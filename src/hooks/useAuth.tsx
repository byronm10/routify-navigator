
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CognitoUser, AuthenticationDetails, CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";

// Configuration for AWS Cognito - these would be your actual AWS Cognito details
const poolData = {
  UserPoolId: "YOUR_USER_POOL_ID", // Replace with your actual User Pool ID
  ClientId: "YOUR_CLIENT_ID", // Replace with your actual Client ID
};

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
    checkAuthState();
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
            if (session.isValid()) {
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
      const attributeList = [
        new CognitoUserAttribute({ Name: "name", Value: name }),
        new CognitoUserAttribute({ Name: "email", Value: email }),
      ];

      userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  };

  const confirmSignUp = (email: string, code: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  };

  const signIn = (email: string, password: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const userData = {
        Username: email,
        Pool: userPool,
      };

      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          setIsAuthenticated(true);
          setUser(cognitoUser);
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };

  const signOut = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
      setIsAuthenticated(false);
      setUser(null);
    }
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
