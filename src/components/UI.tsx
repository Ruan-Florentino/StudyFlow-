import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles, BookOpen, LucideIcon, ChevronLeft, Flame, Sparkle } from 'lucide-react';

const ICON_THEMES = {
  primary: { color: '#00E88F', glow: 'rgba(0, 232, 143, 0.5)' },
  orange: { color: '#F97316', glow: 'rgba(249, 115, 22, 0.5)' },
  blue: { color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.5)' },
  purple: { color: '#A855F7', glow: 'rgba(168, 85, 247, 0.5)' },
  rose: { color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.5)' },
  amber: { color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' },
  cyan: { color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.5)' },
  violet: { color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.5)' },
  white: { color: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.3)' },
};

export const NeonIcon = ({ 
  icon: Icon, 
  color = 'primary', 
  size = 22, 
  variant = 'outline', 
  animate = false,
  className
}: { 
  icon: LucideIcon; 
  color?: keyof typeof ICON_THEMES; 
  size?: number; 
  variant?: 'outline' | 'filled' | 'glow';
  animate?: 'pulse' | 'float' | 'spin' | 'flicker' | boolean;
  className?: string;
}) => {
  const theme = ICON_THEMES[color as keyof typeof ICON_THEMES] || ICON_THEMES.primary;
  
  const animationClass = animate === 'pulse' ? 'neon-pulse' : 
                        animate === 'float' ? 'icon-float' :
                        animate === 'spin' ? 'animate-spin-slow' :
                        animate === 'flicker' ? 'animate-flicker' : 
                        animate === true ? 'neon-pulse' : '';

  return (
    <div 
      className={cn("relative flex items-center justify-center transition-all duration-500", className)}
      style={{ '--color': theme.color } as any}
    >
      <Icon 
        size={size} 
        strokeWidth={1.5}
        fill={variant === 'filled' ? theme.color : 'none'}
        className={cn(
          "relative z-10 transition-all duration-500",
          (variant === 'glow' || variant === 'filled') && "drop-shadow-[0_0_8px_var(--color)]",
          animationClass
        )}
        style={{ color: theme.color }}
      />
      {variant === 'glow' && (
        <div 
          className="absolute inset-0 blur-md opacity-20 pointer-events-none" 
          style={{ backgroundColor: theme.color }} 
        />
      )}
    </div>
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IconTile = ({ 
  icon: Icon, 
  color = 'primary', 
  size = 'md', 
  glow = false,
  className 
}: { 
  icon: LucideIcon; 
  color?: 'primary' | 'orange' | 'blue' | 'purple' | 'rose' | 'amber' | 'cyan' | 'violet'; 
  size?: 'sm' | 'md' | 'lg'; 
  glow?: boolean;
  className?: string;
}) => {
  const colors = {
    primary: 'bg-[#00E88F]/10 text-[#00E88F] border-[#00E88F]/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    violet: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  };

  const glows = {
    primary: 'shadow-[0_0_20px_rgba(0,232,143,0.3)]',
    orange: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]',
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    rose: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    amber: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    violet: 'shadow-[0_0_20px_rgba(139,92,246,0.3)]',
  };

  const sizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-16 h-16 rounded-3xl',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const validColor = colors[color] ? color : 'primary';

  return (
    <div 
      className={cn(
        "flex items-center justify-center border transition-all duration-300 relative overflow-hidden group/tile cursor-pointer shrink-0",
        sizes[size],
        colors[validColor],
        glow && glows[validColor],
        className
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 to-transparent pointer-events-none", colors[validColor].split(' ')[0].replace('/10', '/5'))} />
      <Icon 
        size={iconSizes[size]} 
        strokeWidth={1.5} 
        className={cn("relative z-10 transition-transform duration-300 group-hover/tile:scale-110")} 
      />
    </div>
  );
};

export const AnimatedButton = ({ 
  children, 
  onClick, 
  className, 
  variant = 'primary',
  disabled = false,
  glow = false
}: { 
  children: React.ReactNode; 
  onClick?: (e?: any) => void; 
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  glow?: boolean;
}) => {
  const variants = {
    primary: 'bg-primary text-black font-bold hover:bg-primary/90',
    secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 backdrop-blur-md',
    ghost: 'bg-transparent text-white hover:bg-white/5',
    danger: 'bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 border border-red-500/20 backdrop-blur-md',
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.95 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'px-6 py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-sm',
        variants[variant],
        glow && 'shadow-[0_0_20px_rgba(0,232,143,0.25)]',
        disabled && 'opacity-50 cursor-not-allowed grayscale',
        className
      )}
    >
      {children}
    </motion.button>
  );
};

export const GlassCard = ({ children, className, glow = false, onClick, id, style }: { children: React.ReactNode; className?: string; glow?: boolean; onClick?: () => void; id?: string; style?: React.CSSProperties }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    onClick={onClick}
    style={style}
    className={cn(
      'bg-black/40 backdrop-blur-2xl border border-white/10 p-6 rounded-[24px] relative overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-black/50', 
      glow && 'shadow-[0_0_30px_rgba(0,232,143,0.1)] border-primary/30', 
      className
    )}
  >
    {children}
  </motion.div>
);

export const QuickAccessCard = ({ icon: Icon, title, subtitle, onClick, color = "text-primary", bg = "bg-primary/10" }: { icon: any; title: string; subtitle: string; onClick: () => void; color?: string; bg?: string }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="bg-black/40 backdrop-blur-xl p-5 rounded-[24px] flex flex-col gap-4 cursor-pointer hover:bg-black/60 transition-all duration-300 border border-white/10 hover:border-white/20 group relative overflow-hidden shadow-lg"
  >
    <div className={cn(bg, color, "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border border-transparent group-hover:border-primary/30 shadow-inner")}>
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div className="space-y-1">
      <span className="font-display font-bold text-base block group-hover:text-primary transition-colors tracking-tight">{title}</span>
      <span className="text-[10px] text-text-secondary uppercase font-premium-mono tracking-widest">{subtitle}</span>
    </div>
  </motion.div>
);

export const LogoIcon = ({ size = 24, color = "currentColor", strokeWidth = 2.5 }: { size?: number; color?: string; strokeWidth?: number }) => (
  <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
    <BookOpen size={size} color={color} strokeWidth={strokeWidth} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5],
        rotate: [0, 15, -15, 0]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-1 -right-1"
    >
      <Sparkles size={size * 0.4} className="text-white fill-white" />
    </motion.div>
  </div>
);

export const Logo = ({ size = "md", className, showText = false }: { size?: "sm" | "md" | "lg" | "xl" | "xxl"; className?: string; showText?: boolean }) => {
  const sizes = {
    sm: { container: "w-[22px] h-[22px]", icon: 12, text: "text-sm" },
    md: { container: "w-[28px] h-[28px]", icon: 16, text: "text-lg" },
    lg: { container: "w-16 h-16", icon: 32, text: "text-3xl" },
    xl: { container: "w-[90px] h-[90px]", icon: 48, text: "text-4xl" },
    xxl: { container: "w-[120px] h-[120px]", icon: 64, text: "text-5xl" }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("flex items-center gap-3", className)}
    >
      <div className={cn(
        "relative flex items-center justify-center rounded-2xl bg-black border border-primary/50 shadow-[0_0_20px_rgba(0,232,143,0.2)] overflow-hidden group",
        sizes[size].container
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E88F10_1px,transparent_1px),linear-gradient(to_bottom,#00E88F10_1px,transparent_1px)] bg-[size:4px_4px]" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-1 border border-primary/20 border-dashed rounded-full" 
        />
        <LogoIcon size={sizes[size].icon} color="#00E88F" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-display font-black tracking-tighter text-white italic uppercase", sizes[size].text)}>
            Study<span className="text-primary">Flow</span>
          </span>
          <span className="text-[8px] font-premium-mono font-bold text-primary/60 uppercase tracking-[0.3em] -mt-1">Neural Core v3.1</span>
        </div>
      )}
    </motion.div>
  );
};

export const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color }: { progress: number; size?: number; strokeWidth?: number; color?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const themeColor = color || getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '#10B981';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={themeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export const Badge = ({ children, variant = "primary", className, onClick }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger" | "warning" | "orange" | "success"; className?: string; onClick?: () => void }) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-white/5 text-text-secondary border-white/10",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <span 
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 text-[9px] font-premium-mono font-bold rounded-full uppercase border tracking-[0.2em] shadow-sm", 
        variants[variant], 
        onClick && "cursor-pointer hover:brightness-125 transition-all",
        className
      )}
    >
      {children}
    </span>
  );
};

export const Header = ({ 
  title, 
  subtitle,
  icon: Icon, 
  color = 'primary', 
  onBack, 
  onClickTitle,
  rightContent,
  className 
}: { 
  title: string; 
  subtitle?: string;
  icon?: LucideIcon; 
  color?: 'primary' | 'orange' | 'blue' | 'purple' | 'rose' | 'amber' | 'cyan' | 'violet'; 
  onBack?: () => void; 
  onClickTitle?: () => void;
  rightContent?: React.ReactNode;
  className?: string; 
}) => {
  const textColorMap = {
    primary: 'text-primary',
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    rose: 'text-rose-500',
    amber: 'text-amber-500',
    cyan: 'text-cyan-500',
    violet: 'text-violet-500',
  };

  return (
    <header className={cn("flex items-center justify-between relative z-10 w-full", className)}>
      <div className="flex items-center gap-4">
        {onBack && (
          <AnimatedButton onClick={onBack} variant="secondary" className="p-2 rounded-xl w-10 h-10 shrink-0 border-white/10">
            <ChevronLeft size={20} strokeWidth={2} />
          </AnimatedButton>
        )}
        <div className={cn("flex items-center gap-3", onClickTitle && "cursor-pointer")} onClick={onClickTitle}>
          {Icon && <IconTile icon={Icon} color={color} size="md" className="rounded-full" />}
          <div className="flex flex-col">
            {subtitle && (
              <span className={cn("text-[10px] font-premium-mono font-bold uppercase tracking-[0.2em] -mb-1", textColorMap[color])}>
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl font-premium-title italic tracking-tight flex items-baseline">
              {title}<span className={cn("font-normal not-italic ml-1 text-sm", textColorMap[color])}>.</span>
            </h2>
          </div>
        </div>
      </div>
      {rightContent && (
        <div className="flex items-center shrink-0">
          {rightContent}
        </div>
      )}
    </header>
  );
};


export const MindMapNode = ({ label, color = "border-primary", subNodes = [] }: { label: string; color?: string; subNodes?: string[] }) => (
  <div className="flex flex-col items-center gap-4">
    <div className={cn("px-4 py-2 glass rounded-2xl border-2 font-bold text-sm text-center min-w-[100px]", color)}>
      {label}
    </div>
    {subNodes.length > 0 && (
      <div className="flex gap-4">
        {subNodes.map((node, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-px h-4 bg-white/20" />
            <div className="px-3 py-1.5 glass rounded-xl border border-white/10 text-[10px] font-medium">
              {node}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
