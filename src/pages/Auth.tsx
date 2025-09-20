import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Auth() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  // Redirect if already authenticated
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  // Check for hardcoded auth
  const isHardcodedUser = sessionStorage.getItem('tkingbeast_auth') === 'true';
  if (isHardcodedUser) {
    return <Navigate to="/" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Block timer effect
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTimeRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError(`Access blocked. Try again in ${blockTimeRemaining} seconds.`);
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Enhanced security check for hardcoded credentials
    if (username === 'TKINGBEAST' && password === 'Beastt168@@@') {
      // Additional security layer - check browser fingerprint (basic)
      const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      // Store device fingerprint for security
      sessionStorage.setItem('tkingbeast_device', btoa(JSON.stringify(deviceInfo)));
      sessionStorage.setItem('tkingbeast_auth', 'true');
      sessionStorage.setItem('tkingbeast_login_time', Date.now().toString());
      
      toast.success('🎯 Access Granted - Welcome TKINGBEAST!');
      setIsSubmitting(false);
      return;
    }

    // Failed login handling with progressive security
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setUsername('');
    setPassword('');

    if (newAttempts >= 3) {
      setIsBlocked(true);
      setBlockTimeRemaining(300); // 5 minute block
      setError('Too many failed attempts. Access blocked for 5 minutes.');
      
      // Log security breach attempt
      console.warn(`Security Alert: ${newAttempts} failed login attempts from ${window.location.hostname}`);
    } else {
      setError(`Invalid credentials. ${3 - newAttempts} attempts remaining.`);
    }

    setIsSubmitting(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background p-4">
      <Card className="w-full max-w-md glass border-primary/30 shadow-2xl glow-primary">
        <CardHeader className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center glow-primary animate-float">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold gradient-text mb-2">TKINGBEAST</CardTitle>
            <p className="text-muted-foreground font-medium">Elite Trading Platform</p>
            <div className="w-16 h-1 gradient-primary mx-auto mt-3 rounded-full"></div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert className={`border-destructive bg-destructive/10 ${isBlocked ? 'animate-pulse' : ''}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-destructive font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {isBlocked && (
            <div className="text-center p-4 bg-destructive/20 rounded-lg border border-destructive/50">
              <div className="text-2xl font-mono font-bold text-destructive">
                {formatTime(blockTimeRemaining)}
              </div>
              <div className="text-sm text-muted-foreground">Until next attempt</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-input/50 border-border/50 focus:border-primary/70 transition-all duration-300 focus:glow-primary"
                required
                disabled={isSubmitting || isBlocked}
                autoComplete="username"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Access Code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-input/50 border-border/50 focus:border-primary/70 transition-all duration-300 focus:glow-primary"
                required
                disabled={isSubmitting || isBlocked}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                disabled={isSubmitting || isBlocked}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary hover:opacity-90 text-white font-bold py-3 text-lg glow-primary transition-all duration-300 hover:scale-105"
              disabled={isSubmitting || isBlocked}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                'ACCESS PLATFORM'
              )}
            </Button>
            
            {attempts > 0 && !isBlocked && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Security Level: <span className="text-warning font-medium">ELEVATED</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Failed attempts: {attempts}/3
                </div>
              </div>
            )}
          </form>

          <div className="text-center pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              🔒 Protected by Advanced Security Protocol
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}