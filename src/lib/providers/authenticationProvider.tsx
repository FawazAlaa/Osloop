"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useRouter } from "next/navigation";

export type AuthUser = {
  id: number;
  name:string,
  email: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginSuccess: (user: AuthUser) => void;  //el baste5dmha fel loginpage
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null, 
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser); //kda waaaaaaaaaaaaaaaaaaa7d
  const router = useRouter();

  const loginSuccess = (user: AuthUser) => {   //baset it hna 
    setUser(user);
  };

  const logout = async () => {  //3lshan el cookie
    await fetch("/api/logout", { method: "POST" }).catch(() => {});  //el api byreset el cookies 
    setUser(null);

    router.replace("/login"); //replace path to login w a3mal refresh 
    router.refresh();
  };

  const value: AuthContextType = {  //el values ahe conext beta3y
    user,
    isAuthenticated: !!user,  //Moshkelaaa deh 3amltly 
    loginSuccess,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
