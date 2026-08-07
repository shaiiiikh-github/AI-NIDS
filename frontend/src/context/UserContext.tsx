// src/context/UserContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface User {
  fullName: string;
  email: string;
  role: string;
  organization?: string;
  createdAt?: string;
  avatar?: string;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    fullName: 'SecOps Lead',
    email: 'admin@sec.enterprise',
    role: 'Security Analyst',
    organization: 'Acme Inc',
    createdAt: new Date().toISOString(),
  });

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};