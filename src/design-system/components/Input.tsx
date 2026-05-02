import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  onClear?: () => void;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  onClear,
  containerClassName = '',
  className = '',
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const inputId = id || label.replace(/\s+/g, '-').toLowerCase();
  
  // Convert value to string to check length safely
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`relative w-full ${containerClassName}`}>
      <div 
        className={`
          relative flex items-center w-full h-14 rounded-2xl border transition-all duration-300 bg-[#141416]
          ${error ? 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : isFocused ? 'border-[#00E88F] shadow-[0_0_15px_rgba(0,232,143,0.15)] bg-[#1a1a1c]' : 'border-white/10 hover:border-white/20'}
        `}
      >
        {icon && (
          <div className={`pl-4 flex items-center justify-center transition-colors ${isFocused ? 'text-[#00E88F]' : 'text-white/40'}`}>
            {icon}
          </div>
        )}
        
        <div className="relative flex-1 h-full flex flex-col justify-center px-4">
          <motion.label
            htmlFor={inputId}
            initial={false}
            animate={{
              y: (isFocused || hasValue) ? -12 : 0,
              scale: (isFocused || hasValue) ? 0.75 : 1,
              opacity: (isFocused || hasValue) ? 0.7 : 0.5
            }}
            transition={{ duration: 0.2, type: 'tween' }}
            className={`absolute left-4 origin-left pointer-events-none font-medium ${error ? 'text-rose-500' : isFocused ? 'text-[#00E88F]' : 'text-white'}`}
          >
            {label}
          </motion.label>
          
          <input
            {...props}
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full bg-transparent outline-none text-white font-medium text-base pt-4 pb-1 ${className}`}
          />
        </div>

        {onClear && hasValue && (
          <button 
            type="button" 
            onClick={onClear}
            className="pr-4 flex items-center justify-center text-white/40 hover:text-white transition-colors outline-none"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {(error || helperText) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs mt-2 ml-4 font-medium ${error ? 'text-rose-400' : 'text-white/40'}`}
          >
            {error || helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';
