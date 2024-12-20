"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface AuthContextType {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  getTitle: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);

  const getTitle = () => {
    return isLogin ? "Welcome Back" : "Create an Account";
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setIsLogin,
        getTitle,
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