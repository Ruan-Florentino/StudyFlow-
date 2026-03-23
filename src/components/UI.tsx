import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sparkles } from 'lucide-react';

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
  onClick?: () => void; 
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  glow?: boolean;
}) => {
  const variants = {
    primary: 'bg-primary text-black font-bold hover:bg-primary/90',
    secondary: 'bg-card text-white border border-border hover:bg-card-secondary',
    ghost: 'bg-transparent text-white hover:bg-white/5',
    danger: 'bg-red-500 text-white font-bold hover:bg-red-600',
  };

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.95 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'px-6 py-4 rounded-3xl transition-all flex items-center justify-center gap-2',
        variants[variant],
        glow && 'green-glow-strong',
        disabled && 'opacity-50 cursor-not-allowed grayscale',
        className
      )}
    >
      {children}
    </motion.button>
  );
};

export const GlassCard = ({ children, className, glow = false, onClick }: { children: React.ReactNode; className?: string; glow?: boolean; onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={cn(
      'glass p-6 rounded-[24px] border border-white/5 relative overflow-hidden', 
      glow && 'green-glow border-primary/20', 
      className
    )}
  >
    {glow && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />}
    {children}
  </motion.div>
);

export const QuickAccessCard = ({ icon: Icon, title, subtitle, onClick, color = "text-primary", bg = "bg-primary/10" }: { icon: any; title: string; subtitle: string; onClick: () => void; color?: string; bg?: string }) => (
  <motion.div
    whileTap={{ scale: 0.95 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="glass p-5 rounded-[24px] flex flex-col gap-4 cursor-pointer hover:bg-white/5 transition-all border-white/5 group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="w-1 h-1 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,255,148,0.8)]" />
    </div>
    <div className={cn(bg, color, "w-11 h-11 rounded-2xl flex items-center justify-center group-hover:green-glow transition-all border border-transparent group-hover:border-primary/30")}>
      <Icon size={22} />
    </div>
    <div className="space-y-1">
      <span className="font-premium-title text-sm block group-hover:text-primary transition-colors tracking-tight">{title}</span>
      <span className="text-[9px] text-text-secondary uppercase font-premium-mono font-bold tracking-[0.25em]">{subtitle}</span>
    </div>
  </motion.div>
);

export const Logo = ({ size = "md", className }: { size?: "sm" | "md" | "lg" | "xl"; className?: string }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32"
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "relative flex items-center justify-center",
        sizes[size],
        className
      )}
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
      
      {/* Futuristic 'S' + Brain SVG */}
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
        {/* Minimalist Brain Pattern */}
        <path 
          d="M50 20C35 20 25 30 25 45C25 60 35 70 50 70C65 70 75 60 75 45C75 30 65 20 50 20Z" 
          fill="none" 
          stroke="url(#logo-gradient)" 
          strokeWidth="2" 
          strokeDasharray="4 2"
          className="opacity-40"
        />
        
        {/* Futuristic 'S' */}
        <path 
          d="M70 35C70 25 60 20 50 20C40 20 30 25 30 35C30 45 50 45 50 55C50 65 40 70 30 70M30 65C30 75 40 80 50 80C60 80 70 75 70 65C70 55 50 55 50 45C50 35 60 30 70 30" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="8" 
          strokeLinecap="round"
          className="text-primary"
        />
        
        {/* Central Node */}
        <circle cx="50" cy="50" r="4" fill="currentColor" className="text-primary animate-pulse" />
        
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00BDFF" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = "#00FF94" }: { progress: number; size?: number; strokeWidth?: number; color?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

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
          stroke={color}
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

export const Badge = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger" | "warning" | "orange" | "success" }) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-white/5 text-text-secondary border-white/10",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    success: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <span className={cn("px-2.5 py-1 text-[9px] font-premium-mono font-bold rounded-full uppercase border tracking-[0.2em] shadow-sm", variants[variant])}>
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
