// frontend/src/types/auth.ts

export interface User {
  id: string;
  _id?: string; // Added this to fix the MongoDB ID errors
  name: string;
  email: string;
  role: string;
  profilePic?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  loading: boolean;
  theme: string;           // Added for the Light/Dark mode
  toggleTheme: () => void; // Added for the Light/Dark mode
}