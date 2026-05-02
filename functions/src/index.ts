import * as admin from "firebase-admin";

admin.initializeApp();

export { callGemini } from "./gemini/proxy";
