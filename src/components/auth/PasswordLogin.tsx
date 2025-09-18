import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface PasswordLoginProps {
  onSuccess: () => void;
}

export const PasswordLogin: React.FC<PasswordLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctPassword = 'Beastt168@@@';
    
    if (password === correctPassword) {
      localStorage.setItem('tkingbeast_authenticated', 'true');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword('');

      if (newAttempts >= 2) {
        setShowWarning(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background p-4">
      <Card className="w-full max-w-md glass border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-primary">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold gradient-text">TKINGBEAST</CardTitle>
          <p className="text-muted-foreground">Professional Trading Platform</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {showWarning && (
            <Alert className="border-warning bg-warning/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-warning">
                Warning: Multiple incorrect attempts detected.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-input/50 border-border/50 focus:border-primary"
                required
                autoComplete="off"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary hover:opacity-90 text-white font-semibold"
            >
              Access Platform
            </Button>
            
            {attempts > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Failed attempts: {attempts}/3
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};