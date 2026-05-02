import React, { useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useStore } from '../store';

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const { setUserId, setAuthReady, isAuthReady } = useStore();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        
        // Ensure user document exists
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const initialData = {
              name: user.displayName || 'Estudante',
              xp: 0,
              level: 1,
              streak: 0,
              league: 'Bronze',
              dailyXP: 0,
              lastStudyDate: null,
              dailyGoalMinutes: 120,
              profilePic: user.photoURL || '',
              bio: 'Focado na aprovação! 🚀'
            };
            await setDoc(userDocRef, initialData);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }

        // Set up real-time sync for user document
        const unsubscribeUser = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            useStore.setState({
              name: data.name,
              bio: data.bio,
              xp: data.xp,
              level: data.level,
              streak: data.streak,
              league: data.league,
              dailyXP: data.dailyXP,
              lastStudyDate: data.lastStudyDate,
              dailyGoalMinutes: data.dailyGoalMinutes,
              profilePic: data.profilePic
            });
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        });

        // Sync sub-collections
        const syncCollection = (collectionName: string, storeKey: string) => {
          const colRef = collection(db, 'users', user.uid, collectionName);
          return onSnapshot(colRef, (snapshot) => {
            let items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // Sort history by timestamp descending (most recent first)
            if (collectionName === 'history') {
              items = items.sort((a: any, b: any) => {
                const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return tb - ta;
              });
            }
            
            useStore.setState({ [storeKey]: items } as any);
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${user.uid}/${collectionName}`);
          });
        };

        const unsubSessions = syncCollection('sessions', 'sessions');
        const unsubFlashcards = syncCollection('flashcards', 'flashcards');
        const unsubDecks = syncCollection('decks', 'decks');
        const unsubNotes = syncCollection('notes', 'notes');
        const unsubChat = syncCollection('chatHistory', 'chatHistory');
        const unsubHistory = syncCollection('history', 'history');

        // Sync global leaderboard
        const lbRef = collection(db, 'leaderboard');
        const unsubLeaderboard = onSnapshot(lbRef, (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          useStore.setState({ leaderboard: items } as any);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'leaderboard');
        });

        setAuthReady(true);

        return () => {
          unsubscribeUser();
          unsubSessions();
          unsubFlashcards();
          unsubDecks();
          unsubNotes();
          unsubChat();
          unsubHistory();
          unsubLeaderboard();
        };
      } else {
        setUserId(null);
        setAuthReady(true);
      }
    });

    return () => unsubscribeAuth();
  }, [setUserId, setAuthReady]);

  return <>{children}</>;
};
