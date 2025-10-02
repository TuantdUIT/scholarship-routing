"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";

import { authApi } from "@/core/services/auth-api";
import { firebaseAuth } from "@/core/services/firebase-client";
import {
  type AuthUser,
  userService,
} from "@/core/services/user-service";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthUser | null>;
  signInWithGoogle: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const deriveDisplayName = (
  firebaseUser: FirebaseUser,
  profile: Record<string, unknown> | null,
): string | null => {
  if (firebaseUser.displayName) {
    return firebaseUser.displayName;
  }
  const profileName = profile?.display_name ?? profile?.name;
  if (typeof profileName === "string" && profileName.length > 0) {
    return profileName;
  }
  return firebaseUser.email ?? null;
};

const deriveEmail = (
  firebaseUser: FirebaseUser,
  profile: Record<string, unknown> | null,
): string | null => {
  if (firebaseUser.email) {
    return firebaseUser.email;
  }
  const profileEmail = profile?.email;
  return typeof profileEmail === "string" ? profileEmail : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(userService.getUser());
  const [isLoading, setIsLoading] = useState(true);

  const syncUser = useCallback(async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      userService.clearUser();
      setUser(null);
      return null;
    }

    try {
      const token = await firebaseUser.getIdToken();
      await authApi.verify({ id_token: token });

      let profile: Record<string, unknown> | null = null;
      try {
        profile = await authApi.getProfile(firebaseUser.uid);
      } catch (profileError) {
        console.warn("Unable to load user profile", profileError);
      }

      const authUser: AuthUser = {
        id: firebaseUser.uid,
        name: deriveDisplayName(firebaseUser, profile),
        email: deriveEmail(firebaseUser, profile),
        avatar: firebaseUser.photoURL,
        token,
        profile,
      };

      userService.saveUser(authUser);
      setUser(authUser);
      return authUser;
    } catch (error) {
      console.error("Failed to synchronise Firebase user", error);
      userService.clearUser();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      await syncUser(firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [syncUser]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const synced = await syncUser(credential.user);
      if (!synced) {
        throw new Error("Unable to complete sign in. Please try again.");
      }
      return synced;
    },
    [syncUser],
  );

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(firebaseAuth, provider);
    const synced = await syncUser(credential.user);
    if (!synced) {
      throw new Error("Unable to complete sign in. Please try again.");
    }
    return synced;
  }, [syncUser]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(firebaseAuth);
    await syncUser(null);
  }, [syncUser]);

  const refreshUser = useCallback(async () => {
    const current = firebaseAuth.currentUser;
    if (!current) {
      userService.clearUser();
      setUser(null);
      return null;
    }
    const synced = await syncUser(current);
    if (!synced) {
      throw new Error("Unable to refresh the current session.");
    }
    return synced;
  }, [syncUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      refreshUser,
    }),
    [user, isLoading, signInWithEmail, signInWithGoogle, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
