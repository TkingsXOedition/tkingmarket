import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PasswordLoginProps {
  onSuccess: () => void;
}

export const PasswordLogin: React.FC<PasswordLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    // Generate device fingerprint
    const generateDeviceId = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx?.fillText('Device fingerprint', 10, 50);
      const fingerprint = canvas.toDataURL();
      
      const deviceInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        fingerprint
      };
      
      return btoa(JSON.stringify(deviceInfo));
    };

    const id = generateDeviceId();
    setDeviceId(id);
    checkDeviceStatus(id);
  }, []);

  const checkDeviceStatus = async (deviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('device_attempts')
        .select('attempts, blocked_until')
        .eq('device_id', deviceId)
        .single();

      if (data) {
        const now = new Date();
        const blockedUntil = data.blocked_until ? new Date(data.blocked_until) : null;
        
        if (blockedUntil && now < blockedUntil) {
          setIsBlocked(true);
        } else {
          setAttempts(data.attempts || 0);
        }
      }
    } catch (error) {
      console.error('Error checking device status:', error);
    }
  };

  const updateDeviceAttempts = async (newAttempts: number, block = false) => {
    const blockedUntil = block ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null; // 24 hours block
    
    try {
      const { error } = await supabase
        .from('device_attempts')
        .upsert({
          device_id: deviceId,
          attempts: newAttempts,
          blocked_until: blockedUntil,
          last_attempt: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating device attempts:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) return;

    const correctPassword = 'Beastt168@@@';
    
    if (password === correctPassword) {
      // Reset attempts on successful login
      await updateDeviceAttempts(0);
      localStorage.setItem('tkingbeast_authenticated', 'true');
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword('');

      if (newAttempts === 2) {
        setShowWarning(true);
      } else if (newAttempts >= 3) {
        setIsBlocked(true);
        await updateDeviceAttempts(newAttempts, true);
      } else {
        await updateDeviceAttempts(newAttempts);
      }
    }
  };

  // Disable copy, paste, and context menu
  useEffect(() => {
    const disableCopy = (e: Event) => e.preventDefault();
    const disableContextMenu = (e: Event) => e.preventDefault();
    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 's')) {
        e.preventDefault();
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };

    document.addEventListener('copy', disableCopy);
    document.addEventListener('paste', disableCopy);
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('selectstart', disableCopy);

    return () => {
      document.removeEventListener('copy', disableCopy);
      document.removeEventListener('paste', disableCopy);
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('selectstart', disableCopy);
    };
  }, []);

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-accent/20 p-4">
        <Card className="w-full max-w-md border-destructive bg-card/50 backdrop-blur-lg">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
            <CardTitle className="text-2xl text-destructive">Device Blocked</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              This device has been blocked due to multiple failed login attempts.
            </p>
            <p className="text-sm text-destructive">
              Access will be restored in 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background p-4">
      <Card className="w-full max-w-md glass border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center glow-primary">
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
                Warning: One more incorrect attempt will block this device for 24 hours.
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
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onSelect={(e) => e.preventDefault()}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-primary hover:opacity-90 text-white font-semibold"
              disabled={isBlocked}
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