import { createContext } from "react";
import { IUSer } from "../interfaces"; // Adjust the path as needed

// Define the context type
interface UserContextType {
  user: IUSer | null;
  setUser: (user: IUSer | null) => void;
}

// Create the context with default values
export const UserContext = createContext<UserContextType | null>(null);
