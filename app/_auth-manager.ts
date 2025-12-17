import { supabase } from '../supabase';

class AuthManager {
  private static instance: AuthManager;
  private isInitialized = false;
  private isCheckingAuth = false;
  private authStateListeners: ((isLoggedIn: boolean) => void)[] = [];

  private constructor() {}

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized || this.isCheckingAuth) {
      return false;
    }

    this.isCheckingAuth = true;
    console.log("AuthManager: Initializing auth state");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const isLoggedIn = !!session;
      
      // If session exists but email is not confirmed, don't log in
      if (session && !session.user.email_confirmed_at) {
        console.log("AuthManager: Session exists but email not confirmed, signing out");
        await supabase.auth.signOut();
        console.log("AuthManager: Initial auth state - NOT logged in (email not confirmed)");
        this.isInitialized = true;
        this.isCheckingAuth = false;
        this.authStateListeners.forEach(listener => listener(false));
        return false;
      }
      
      console.log("AuthManager: Initial auth state - logged in:", isLoggedIn);
      
      this.isInitialized = true;
      this.isCheckingAuth = false;
      
      // Notify all listeners
      this.authStateListeners.forEach(listener => listener(isLoggedIn));
      
      return isLoggedIn;
    } catch (error) {
      console.error("AuthManager: Error checking auth:", error);
      this.isCheckingAuth = false;
      return false;
    }
  }

  async handleEmailVerification(): Promise<void> {
    console.log("AuthManager: Handling email verification flow");
    // Clear any existing session to ensure clean state
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log("Clearing session after email verification");
      await supabase.auth.signOut();
    }
  }

  subscribe(listener: (isLoggedIn: boolean) => void): () => void {
    this.authStateListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(listener);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export const authManager = AuthManager.getInstance();

// ADD THIS AT THE END - it satisfies Expo Router's requirement
export default function AuthManagerPlaceholder() {
  return null;
}