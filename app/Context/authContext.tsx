import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Children,
} from "react";

interface AuthContextType {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  emailSubmitted: boolean;
  setEmailSubmitted: (value: boolean) => void;
  email: string;
  setEmail: (value: string) => void;
  getTitle: () => string;
  getButtonText: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const getTitle = () => {
    if (isLogin) {
      return emailSubmitted ? "Provide Your Password" : "Welcome Back";
    }
    return "Create an Account";
  };

  const getButtonText = () => {
    if (isLogin) {
      return emailSubmitted ? "Login" : "Continue";
    }
    return "Continue";
  };
  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setIsLogin,
        emailSubmitted,
        setEmailSubmitted,
        email,
        setEmail,
        getTitle,
        getButtonText,
      }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
};
