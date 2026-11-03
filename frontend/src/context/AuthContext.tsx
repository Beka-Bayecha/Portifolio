import { createContext } from "react";

export interface AuthContextType {
  user: import("firebase/auth").User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
