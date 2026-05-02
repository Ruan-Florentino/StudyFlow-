import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getGenAI, GEMINI_API_KEY } from "./geminiClient";

// Initialize admin if not already
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

const PLAN_LIMITS: Record<string, number> = {
  free: 15,
  pro: 200,
  premium: 1000,
};

async function verifyUsageLimit(uid: string) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();
  
  let plan = 'free';
  if (userDoc.exists) {
    plan = userDoc.data()?.plan || 'free';
  }

  const today = new Date().toISOString().slice(0, 10);
  const usageRef = db.collection('usage').doc(`${uid}_${today}`);
  
  return await db.runTransaction(async (t) => {
    const usageDoc = await t.get(usageRef);
    let count = 0;
    
    if (usageDoc.exists) {
      count = usageDoc.data()?.count || 0;
    }

    const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    if (count >= limit) {
      throw new HttpsError("resource-exhausted", `Limite do plano ${plan} excedido para hoje.`);
    }

    if (!usageDoc.exists) {
      t.set(usageRef, { count: 1, uid, date: today }, { merge: true });
    } else {
      t.update(usageRef, { count: count + 1 });
    }
    return plan;
  });
}

export const callGemini = onCall(
  { 
    secrets: [GEMINI_API_KEY],
    region: "southamerica-east1",
    cors: true,
    maxInstances: 10
  },
  async (request) => {
    // 1. Auth check
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Login obrigatório");
    }

    // 2. Usage limit check
    await verifyUsageLimit(request.auth.uid);

    const { model, contents, config } = request.data;

    if (!contents || !Array.isArray(contents)) {
      throw new HttpsError("invalid-argument", "Conteúdo (contents) é obrigatório e deve ser um array.");
    }

    try {
      const genAI = getGenAI();
      const modelInstance = genAI.models.get(model || 'gemini-2.0-flash');
      
      const result = await modelInstance.generateContent({
        contents,
        config: {
          ...config,
          // Force some safety settings if needed
        }
      });

      return { text: result.text };
    } catch (error: any) {
      console.error("[Gemini Proxy Error]:", error);
      throw new HttpsError("internal", error.message || "Erro interno na IA");
    }
  }
);
