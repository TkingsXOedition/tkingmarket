
import React from 'react';
import { 
  BarChart, PieChart, BarChart3, Wallet, LineChart, Globe, 
  DollarSign, Settings, ChevronRight, ChevronLeft, Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/',
    },
    {
      title: 'Stocks',
      icon: BarChart,
      href: '/stocks',
    },
    {
      title: 'Markets',
      icon: BarChart3,
      href: '/markets',
    },
    {
      title: 'Currencies',
      icon: DollarSign,
      href: '/currencies',
    },
    {
      title: 'Global',
      icon: Globe,
      href: '/global',
    },
    {
      title: 'Portfolio',
      icon: Wallet,
      href: '/portfolio',
    },
    {
      title: 'Performance',
      icon: LineChart,
      href: '/performance',
    },
    {
      title: 'Analysis',
      icon: PieChart,
      href: '/analysis',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
    }
  ];

  return (
    <aside className={cn(
      "bg-sidebar text-sidebar-foreground relative transition-all duration-300 ease-in-out flex flex-col border-r border-sidebar-border",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
        <h2 className={cn(
          "font-semibold tracking-tight transition-opacity duration-200",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          MarketPulse
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "absolute right-2 text-sidebar-foreground h-8 w-8",
            isCollapsed ? "right-2" : "right-4"
          )}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={index}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0")} />
                <span className={cn(
                  "text-sm font-medium transition-opacity duration-200",
                  isCollapsed ? "opacity-0 w-0" : "opacity-100"
                )}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "transition-opacity duration-200 rounded-md bg-sidebar-accent/50 p-2 text-xs text-sidebar-accent-foreground",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          <p className="font-medium">Market Status</p>
          <p>Markets are open</p>
          <p className="text-[10px]">Closes in 3h 45m</p>
        </div>
      </div>
    </aside>
  );
}
