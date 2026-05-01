import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load profile from Firestore
        try {
          const ref = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setUserProfile(snap.data());
          }
        } catch (_) {
          // Firebase not configured – use localStorage fallback
          const local = localStorage.getItem('vs_profile');
          if (local) setUserProfile(JSON.parse(local));
        }
      } else {
        setUser(null);
        setUserProfile(null);
        // Load guest profile from localStorage
        const local = localStorage.getItem('vs_profile');
        if (local) setUserProfile(JSON.parse(local));
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const continueAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (_) {
      // Firebase not configured – just set a guest user locally
      const guestUser = { uid: 'guest_' + Date.now(), isAnonymous: true, displayName: 'Guest' };
      setUser(guestUser);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (_) {}
    setUser(null);
    setUserProfile(null);
  };

  const saveProfile = async (profile) => {
    const merged = { ...userProfile, ...profile, updatedAt: new Date().toISOString() };
    setUserProfile(merged);
    localStorage.setItem('vs_profile', JSON.stringify(merged));
    if (user && !user.uid?.startsWith('guest_')) {
      try {
        await setDoc(doc(db, 'users', user.uid), merged, { merge: true });
      } catch (_) {}
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, continueAsGuest, logout, saveProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
