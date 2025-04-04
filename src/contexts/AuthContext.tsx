
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  userName: string | null;
  userRole: 'user' | 'admin' | null;
  login: (email: string, role?: 'user' | 'admin') => void;
  logout: () => void;
  signup: (email: string, name: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userEmail: null,
  userName: null,
  userRole: null,
  login: () => {},
  logout: () => {},
  signup: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole") as 'user' | 'admin';
    
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
      setUserEmail(storedUserEmail);
      setUserName(storedUserName);
      setUserRole(storedUserRole);
    }
  }, []);

  const login = (email: string, role: 'user' | 'admin' = 'user') => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserRole(role);
    
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setUserName(null);
    setUserRole(null);
    
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
  };

  const signup = (email: string, name: string) => {
    localStorage.setItem("registeredEmail", email);
    localStorage.setItem("registeredName", name);
    setUserName(name);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        userEmail, 
        userName, 
        userRole, 
        login, 
        logout, 
        signup 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
