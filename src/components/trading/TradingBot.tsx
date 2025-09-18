import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, X, TrendingUp, TrendingDown, Zap, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TradingBotProps {
  className?: string;
}

export const TradingBot: React.FC<TradingBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const botMessages = [
    "🚀 XAU/USD showing strong bullish momentum! Time to ride the wave!",
    "💎 Market volatility detected! Perfect for swing trading opportunities!",
    "⚡ Breaking news could impact gold prices - stay alert!",
    "🎯 Technical indicators suggest a potential breakout incoming!",
    "🔥 Volume surge detected! Big players are making moves!",
    "💰 Your portfolio is looking mighty fine today, beast!",
    "🎪 Market circus is in town - time to be the ringmaster!",
    "⭐ Stars are aligning for some epic trades today!",
    "🦅 Eagle eye spotted some juicy opportunities!",
    "🎮 Game time! Let's make some serious moves!"
  ];

  const excitedActions = [
    "Let's gooo! 🚀",
    "To the moon! 🌙",
    "Beast mode ON! 💪",
    "Money printer go BRRR! 💸",
    "Diamond hands! 💎",
    "Stonks only go up! 📈"
  ];

  useEffect(() => {
    // Show bot periodically with random messages
    const interval = setInterval(() => {
      if (!isOpen && Math.random() > 0.7) {
        showBotMessage();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const showBotMessage = () => {
    setIsOpen(true);
    setIsTyping(true);
    
    setTimeout(() => {
      setMessage(botMessages[Math.floor(Math.random() * botMessages.length)]);
      setIsTyping(false);
    }, 1500);
  };

  const handleExcitedAction = () => {
    const action = excitedActions[Math.floor(Math.random() * excitedActions.length)];
    setMessage(action);
    
    // Add some fun visual effects
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Create confetti effect
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.innerHTML = '✨';
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = Math.random() * window.innerHeight + 'px';
        confetti.style.fontSize = '20px';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        confetti.style.color = randomColor;
        document.body.appendChild(confetti);
        
        setTimeout(() => {
          confetti.remove();
        }, 2000);
      }, i * 100);
    }
  };

  return (
    <>
      {/* Bot Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full gradient-primary shadow-lg hover:shadow-xl glow-primary"
          size="icon"
        >
          <Bot className="h-8 w-8 text-white" />
        </Button>
      </motion.div>

      {/* Bot Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-2rem)]"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="glass border-primary/30 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-foreground">TradingBeast AI</span>
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 rounded-full hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {isTyping ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm">TradingBeast is thinking...</span>
                    </div>
                  ) : (
                    <div className="bg-muted/50 rounded-lg p-3 text-sm">
                      {message || "Hey there, trading beast! Ready to dominate the markets? 🚀"}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExcitedAction}
                      className="text-xs hover:bg-primary/20 border-primary/30"
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Pump it!
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage("📊 Analyzing market trends... Looking bullish!")}
                      className="text-xs hover:bg-success/20 border-success/30"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Analyze
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMessage("💰 Time to secure those profits, champ!")}
                      className="text-xs hover:bg-warning/20 border-warning/30"
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      Profit!
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};