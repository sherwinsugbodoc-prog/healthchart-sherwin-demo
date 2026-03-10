import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  FlaskConical,
  Pill,
  Image,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  MoreHorizontal,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';

interface NavItem {
  id: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
  primary?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', primary: true },
  { id: 'patients', icon: Users, label: 'Patients', badge: 4, primary: true },
  { id: 'schedule', icon: Calendar, label: 'Schedule', primary: true },
  { id: 'messages', icon: MessageSquare, label: 'Messages', badge: 3, primary: true },
  { id: 'orders', icon: FlaskConical, label: 'Orders' },
  { id: 'prescriptions', icon: Pill, label: 'Prescriptions' },
  { id: 'imaging', icon: Image, label: 'Imaging' },
  { id: 'documents', icon: FileText, label: 'Documents' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
];

interface NavRailProps {
  collapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (id: string) => void;
}

export function NavRail({ collapsed, onToggle, activeItem, onItemClick }: NavRailProps) {
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);

  // Mobile: bottom tab bar with primary items + "More"
  if (isMobile) {
    const primaryItems = navItems.filter(i => i.primary);
    const secondaryItems = navItems.filter(i => !i.primary);

    return (
      <>
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-sidebar border-t border-sidebar-border flex items-center justify-around h-14 safe-area-bottom">
          {primaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative transition-colors min-w-[44px]',
                activeItem === item.id
                  ? 'text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/60'
              )}
            >
              {activeItem === item.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-b-full" />
              )}
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-1.5 right-1/2 translate-x-3 bg-white/20 text-white text-[9px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-sidebar-foreground/60 min-w-[44px]"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>

        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl pb-8">
            <SheetHeader className="pb-2">
              <SheetTitle className="text-left">More</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3">
              {secondaryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onItemClick(item.id); setMoreOpen(false); }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl transition-colors min-h-[72px]',
                    activeItem === item.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => { onItemClick('settings'); setMoreOpen(false); }}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-xl transition-colors min-h-[72px]',
                  activeItem === 'settings'
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Settings className="h-6 w-6" />
                <span className="text-xs font-medium">Settings</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop/Tablet: vertical sidebar rail
  return (
    <div className={cn(
      'nav-rail h-full transition-all duration-200 flex flex-col',
      collapsed ? 'w-14' : 'w-48'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-center h-14 border-b border-sidebar-border">
        <Stethoscope className="h-6 w-6 text-sidebar-foreground" />
        {!collapsed && (
          <span className="ml-2 font-bold text-sidebar-foreground text-lg">SugboDoc</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onItemClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 mx-auto transition-colors relative',
                  collapsed ? 'justify-center' : 'justify-start',
                  activeItem === item.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {item.badge && (
                  <span className={cn(
                    'bg-white/20 text-white text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center',
                    collapsed ? 'absolute top-1 right-1' : 'ml-auto'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="font-medium">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>

      {/* Settings & Collapse */}
      <div className="border-t border-sidebar-border py-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onItemClick('settings')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 transition-colors',
                collapsed ? 'justify-center' : 'justify-start',
                activeItem === 'settings'
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Settings className="h-5 w-5" />
              {!collapsed && <span className="text-sm font-medium">Settings</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">Settings</TooltipContent>
          )}
        </Tooltip>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center py-2 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
