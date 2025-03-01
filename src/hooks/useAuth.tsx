
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";

// Configuration for AWS Cognito - these would be your actual AWS Cognito details
const poolData = {
  UserPoolId: "mock-user-pool-id",
  ClientId: "mock-client-id",
};

// For development purposes only
const MOCK_USERS = [
  { email: "user@example.com", password: "password123", name: "Test User" }
];

const userPool = new CognitoUserPool(poolData);

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  signUp: (name: string, email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => void;
  confirmSignUp: (email: string, code: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check if we have a stored user in localStorage
    const storedUser = localStorage.getItem("mockUser");
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = userPool.getCurrentUser();
      if (currentUser) {
        await new Promise<void>((resolve, reject) => {
          currentUser.getSession((err: Error | null, session: any) => {
            if (err) {
              reject(err);
              return;
            }
            if (session && session.isValid()) {
              setIsAuthenticated(true);
              setUser(currentUser);
            }
            resolve();
          });
        });
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = (name: string, email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      // For development, just simulate signup success
      console.log("Mock signup with:", { name, email, password });
      resolve({ user: { email } });
    });
  };

  const confirmSignUp = (email: string, code: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      // For development, just simulate confirmation success
      console.log("Mock confirmation with:", { email, code });
      resolve("SUCCESS");
    });
  };

  const signIn = (email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Check against mock users
      const mockUser = MOCK_USERS.find(
        (user) => user.email === email && user.password === password
      );

      if (mockUser) {
        const userObj = {
          email: mockUser.email,
          name: mockUser.name,
          getSession: (callback: any) => {
            callback(null, {
              isValid: () => true,
              getIdToken: () => ({
                getJwtToken: () => "mock-jwt-token"
              })
            });
          }
        };
        
        setIsAuthenticated(true);
        setUser(userObj);
        
        // Store the user in localStorage for persistence
        localStorage.setItem("mockUser", JSON.stringify(userObj));
        
        resolve({ user: userObj });
      } else {
        reject(new Error("Invalid credentials"));
      }
    });
  };

  const signOut = () => {
    localStorage.removeItem("mockUser");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signUp,
        signIn,
        signOut,
        confirmSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
