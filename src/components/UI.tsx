import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon, ChevronLeft, Flame, Sparkle, Loader2 } from 'lucide-react';
import { easings, springs, tweens } from '../lib/animations/easings';

const APP_ICON_SRC = '/icons/app-icon.png?v=5';

const ICON_THEMES = {
  primary: { color: '#00E88F', glow: 'rgba(var(--hub-primary-rgb), 0.35)' },
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
      className={cn("relative flex items-center justify-center transition-[opacity,transform] [transition-duration:var(--duration-slow)] [transition-timing-function:var(--ease-smooth-out)]", className)}
      style={{ '--color': theme.color } as any}
    >
      <Icon 
        size={size} 
        strokeWidth={1.5}
        fill={variant === 'filled' ? theme.color : 'none'}
        className={cn(
          "relative z-10 transition-[opacity,transform,filter] [transition-duration:var(--duration-slow)] [transition-timing-function:var(--ease-smooth-out)]",
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
    primary: 'bg-primary/12 text-primary border-primary/25',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    violet: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  };

  const glows = {
    primary: 'shadow-[0_0_20px_rgba(var(--hub-primary-rgb),0.25)]',
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
        "flex items-center justify-center border transition-[transform,border-color,box-shadow] [transition-duration:var(--duration-normal)] [transition-timing-function:var(--ease-smooth-out)] relative overflow-hidden group/tile cursor-pointer shrink-0",
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
        className={cn("relative z-10 transition-transform [transition-duration:var(--duration-normal)] [transition-timing-function:var(--ease-smooth-out)] group-hover/tile:scale-110")} 
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
  glow = false,
  loading = false,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  glow?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  const reduceMotion = useReducedMotion() ?? false;
  const variants = {
    primary: 'bg-[linear-gradient(135deg,#baffea_0%,var(--hub-primary)_42%,#38dba3_100%)] text-black font-black border border-white/20 hover:brightness-105 shadow-[0_12px_30px_rgba(var(--hub-primary-rgb),0.24)]',
    secondary: 'bg-white/[0.075] text-white border border-white/[0.12] hover:bg-white/[0.12] hover:border-white/[0.22] backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]',
    ghost: 'bg-transparent text-white hover:bg-white/[0.07] hover:text-primary',
    danger: 'bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20 border border-red-500/20 backdrop-blur-xl',
  };

  const isBusy = disabled || loading;
  const primaryGlow =
    '0 10px 28px rgba(var(--hub-primary-rgb),0.28), 0 0 24px rgba(var(--hub-primary-rgb),0.14)';

  return (
    <motion.button
      type={type}
      transition={reduceMotion ? tweens.micro : springs.soft}
      whileTap={isBusy || reduceMotion ? undefined : { scale: 0.98 }}
      whileHover={
        isBusy || reduceMotion
          ? undefined
          : {
              scale: 1.02,
              ...(variant === 'primary' || glow ? { boxShadow: primaryGlow } : {}),
            }
      }
      onClick={isBusy ? undefined : onClick}
      disabled={isBusy}
      className={cn(
        'relative isolate min-h-11 px-6 py-3.5 rounded-2xl inline-flex items-center justify-center gap-2 overflow-hidden text-sm shadow-sm',
        'transition-shadow [transition-duration:var(--duration-normal)] [transition-timing-function:var(--ease-snappy)]',
        variant === 'primary' && !isBusy && 'relative overflow-hidden',
        variant === 'primary' &&
          !isBusy &&
          'before:absolute before:inset-0 before:-translate-x-full before:skew-x-[-18deg] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-full',
        variants[variant],
        glow && !isBusy && 'shadow-[0_18px_38px_rgba(var(--hub-primary-rgb),0.24)]',
        isBusy && 'opacity-70 cursor-not-allowed',
        disabled && !loading && 'grayscale',
        className
      )}
    >
      {loading && <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />}
      <span className={cn('inline-flex items-center gap-2', loading && 'opacity-80')}>{children}</span>
    </motion.button>
  );
};

export const GlassCard = ({
  children,
  className,
  glow = false,
  onClick,
  id,
  style,
  enterAnimation = true,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  id?: string;
  style?: React.CSSProperties;
  /** Quando false, entrada fica a cargo do pai (ex.: stagger). */
  enterAnimation?: boolean;
}) => {
  const reduceMotion = useReducedMotion() ?? false;
  return (
  <motion.div
    id={id}
    initial={enterAnimation ? { opacity: 0, scale: reduceMotion ? 1 : 0.988, y: reduceMotion ? 0 : 10 } : false}
    animate={enterAnimation ? { opacity: 1, scale: 1, y: 0 } : undefined}
    transition={reduceMotion ? tweens.micro : springs.card}
    whileHover={onClick && !reduceMotion ? { y: -4, transition: springs.soft } : undefined}
    whileTap={onClick && !reduceMotion ? { scale: 0.988, transition: springs.snappy } : undefined}
    onClick={onClick}
    style={style}
    className={cn(
      'liquid-glass glass-sheen p-6 rounded-[24px] relative isolate overflow-hidden transition-[border-color,box-shadow,transform,background-color] [transition-duration:var(--duration-normal)] [transition-timing-function:var(--ease-smooth-out)] hover:border-white/35',
      onClick && 'cursor-pointer',
      glow && 'shadow-[0_0_30px_rgba(var(--hub-primary-rgb),0.14)] border-primary/35 hover:shadow-[0_0_36px_rgba(var(--hub-primary-rgb),0.2)]',
      className
    )}
  >
    {children}
  </motion.div>
  );
};

export const QuickAccessCard = ({ icon: Icon, title, subtitle, onClick, color = "text-primary", bg = "bg-primary/10" }: { icon: any; title: string; subtitle: string; onClick: () => void; color?: string; bg?: string }) => {
  const reduceMotion = useReducedMotion() ?? false;
  return (
  <motion.div
    whileTap={reduceMotion ? undefined : { scale: 0.97, transition: springs.snappy }}
    whileHover={reduceMotion ? undefined : { scale: 1.02, transition: springs.soft }}
    onClick={onClick}
    className="liquid-glass glass-sheen p-5 rounded-[24px] min-h-[128px] flex flex-col gap-4 cursor-pointer transition-[transform,box-shadow,border-color,background-color] [transition-duration:var(--duration-normal)] [transition-timing-function:var(--ease-smooth-out)] hover:border-white/35 group relative overflow-hidden shadow-lg"
  >
    <div className={cn(bg, color, "w-12 h-12 rounded-2xl flex items-center justify-center transition-[transform,border-color,box-shadow] [transition-duration:var(--duration-normal)] [transition-timing-function:var(--ease-smooth-out)] border border-transparent group-hover:border-primary/30 shadow-inner")}>
      <Icon size={24} strokeWidth={1.5} />
    </div>
    <div className="space-y-1">
      <span className="font-display font-bold text-base block group-hover:text-primary transition-colors [transition-duration:var(--duration-fast)] [transition-timing-function:var(--ease-smooth-out)] tracking-tight">{title}</span>
      <span className="text-[10px] text-text-secondary uppercase font-premium-mono tracking-widest">{subtitle}</span>
    </div>
  </motion.div>
  );
};

export const LogoIcon = ({ size = 24 }: { size?: number }) => (
  <img
    src={APP_ICON_SRC}
    alt=""
    width={size}
    height={size}
    className="object-contain select-none pointer-events-none drop-shadow-[0_0_16px_rgba(var(--hub-primary-rgb),0.36)]"
    decoding="async"
    draggable={false}
  />
);

export const Logo = ({ size = "md", className, showText = false }: { size?: "sm" | "md" | "lg" | "xl" | "xxl"; className?: string; showText?: boolean }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const sizes = {
    sm: { container: "w-[22px] h-[22px]", icon: 12, text: "text-sm" },
    md: { container: "w-[28px] h-[28px]", icon: 16, text: "text-lg" },
    lg: { container: "w-16 h-16", icon: 32, text: "text-3xl" },
    xl: { container: "w-[90px] h-[90px]", icon: 48, text: "text-4xl" },
    xxl: { container: "w-[120px] h-[120px]", icon: 64, text: "text-5xl" }
  };

  return (
    <motion.div
      initial={{ scale: reduceMotion ? 1 : 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={reduceMotion ? tweens.micro : tweens.normal}
      className={cn("flex items-center gap-3", className)}
    >
      <div className={cn(
        "relative flex items-center justify-center rounded-2xl liquid-glass glass-sheen overflow-hidden group",
        sizes[size].container
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary/10 opacity-50" />
        <motion.div 
          animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 20, repeat: Infinity, ease: 'linear' }
          }
          className="absolute -inset-1 border border-white/15 border-dashed rounded-full" 
        />
        <LogoIcon size={sizes[size].icon} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-display font-black tracking-tighter text-white italic uppercase", sizes[size].text)}>
            Study<span className="text-primary">Flow</span>
          </span>
          <span className="text-[8px] font-premium-mono font-bold text-white/50 uppercase tracking-[0.22em] -mt-1">Plataforma de Estudos</span>
        </div>
      )}
    </motion.div>
  );
};

export const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color }: { progress: number; size?: number; strokeWidth?: number; color?: string }) => {
  const reduceMotion = useReducedMotion() ?? false;
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
          transition={reduceMotion ? tweens.micro : { duration: 1, ease: easings.smoothInOut }}
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
