import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  Timestamp
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  credits: number;
  plan: 'free' | 'creator' | 'pro' | 'agency';
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deductCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number, txName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrCreateProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Creator',
          photoURL: firebaseUser.photoURL || '',
          credits: 100, // Starting free credits
          plan: 'creator',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);

        // Also initialize initial credit transaction
        await setDoc(doc(db, 'creditTransactions', `${firebaseUser.uid}_init`), {
          uid: firebaseUser.uid,
          amount: 100,
          type: 'bonus',
          description: 'Welcome Bonus Credits',
          createdAt: Timestamp.now()
        });
      }
    } catch (err) {
      console.error('Error fetching/creating user profile in Firestore:', err);
      setUserProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Creator',
        photoURL: firebaseUser.photoURL || '',
        credits: 100,
        plan: 'creator',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchOrCreateProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      setUserProfile(snap.data() as UserProfile);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google sign in error:', err);
      throw err;
    }
  };

  const signInWithEmail = async (e: string, p: string) => {
    await signInWithEmailAndPassword(auth, e, p);
  };

  const signUpWithEmail = async (e: string, p: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, e, p);
    const userRef = doc(db, 'users', cred.user.uid);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email: e,
      displayName: name,
      photoURL: '',
      credits: 100,
      plan: 'creator',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    await setDoc(userRef, newProfile);
    setUserProfile(newProfile);
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUserProfile(null);
  };

  const deductCredits = async (amount: number): Promise<boolean> => {
    if (!user || !userProfile) return false;
    if (userProfile.credits < amount) return false;

    const newCredits = userProfile.credits - amount;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { credits: newCredits, updatedAt: Timestamp.now() }, { merge: true });
      
      await addDoc(collection(db, 'creditTransactions'), {
        uid: user.uid,
        amount: -amount,
        type: 'usage',
        description: 'AI Video Generation',
        createdAt: Timestamp.now()
      });

      setUserProfile(prev => prev ? { ...prev, credits: newCredits } : null);
      return true;
    } catch (err) {
      console.error('Failed to deduct credits:', err);
      return false;
    }
  };

  const addCredits = async (amount: number, txName: string) => {
    if (!user || !userProfile) return;
    const newCredits = userProfile.credits + amount;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { credits: newCredits, updatedAt: Timestamp.now() }, { merge: true });

      await addDoc(collection(db, 'creditTransactions'), {
        uid: user.uid,
        amount: amount,
        type: 'purchase',
        description: txName,
        createdAt: Timestamp.now()
      });

      setUserProfile(prev => prev ? { ...prev, credits: newCredits } : null);
    } catch (err) {
      console.error('Failed to add credits:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      logout,
      refreshProfile,
      deductCredits,
      addCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
