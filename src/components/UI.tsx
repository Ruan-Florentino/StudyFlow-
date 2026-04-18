import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles, BookOpen } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const GlassCard = ({ children, className, glow = false, onClick, id }: { children: React.ReactNode; className?: string; glow?: boolean; onClick?: () => void; id?: string }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, scale: 0.98, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    onClick={onClick}
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

export const Badge = ({ children, variant = "primary", className }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger" | "warning" | "orange" | "success"; className?: string }) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-white/5 text-text-secondary border-white/10",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <span className={cn("px-2.5 py-1 text-[9px] font-premium-mono font-bold rounded-full uppercase border tracking-[0.2em] shadow-sm", variants[variant], className)}>
      {children}
    </span>
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
