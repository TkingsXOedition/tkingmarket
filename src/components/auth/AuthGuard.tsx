import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Temporarily bypass auth to test basic functionality
  return <>{children}</>;
};