  import { NavLink } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { 
    Home, Compass, Target, 
    PenLine, Users, User 
  } from 'lucide-react';
  import { useStore } from '../store';
  import { useAppNavigation } from '../app/router/useAppNavigation';
  import { preloadRoute } from '../app/router/preload';

  const NAV_ITEMS = [
    { id: 'home',       label: 'INÍCIO',     icon: Home,    color: '#34d399', glow: '52,211,153', path: '/' },
    { id: 'explore',    label: 'EXPLORAR',   icon: Compass, color: '#38bdf8', glow: '56,189,248', path: '/explorar' },
    { id: 'questions',  label: 'QUESTÕES',   icon: Target,  color: '#fbbf24', glow: '251,191,36',  badge: true, path: '/questoes' },
    { id: 'redacao',    label: 'REDAÇÃO',    icon: PenLine, color: '#a78bfa', glow: '167,139,250', path: '/redacao' },
    { id: 'comunidade', label: 'COMUNIDADE', icon: Users,   color: '#f472b6', glow: '244,114,182', path: '/comunidade' },
    { id: 'profile',    label: 'PERFIL',     icon: User,    color: '#818cf8', glow: '129,140,248', path: '/perfil' },
  ];
  
  function triggerHaptic() {
    if ('vibrate' in navigator) navigator.vibrate(10);
  }
  
  export function BottomNav() {
    const { currentTab } = useAppNavigation();
    const { studyRooms } = useStore();
    
    return (
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50
                   pb-[env(safe-area-inset-bottom)]
                   px-2 pb-2 transition-transform duration-500"
        style={{
          transform: currentTab === 'comunidade' && studyRooms.activeRoom ? 'translateY(120%)' : 'translateY(0)'
        }}
      >
        {/* SOMBRA PROJETADA (igual WWDC25) */}
        <div 
          className="absolute inset-x-4 -bottom-2 h-12 
                     pointer-events-none blur-2xl opacity-60"
          style={{
            background: `radial-gradient(ellipse at center, 
              rgba(0,0,0,0.6) 0%, 
              transparent 70%)`,
          }}
        />
        
        {/* LIQUID GLASS CONTAINER */}
        <div 
          className="relative mx-auto max-w-lg
                     overflow-visible rounded-[28px]"
          style={{
            background: `linear-gradient(180deg, 
              rgba(255,255,255,0.12) 0%, 
              rgba(255,255,255,0.04) 50%,
              rgba(255,255,255,0.08) 100%)`,
            backdropFilter: 'blur(32px) saturate(210%) brightness(110%)',
            WebkitBackdropFilter: 'blur(32px) saturate(210%) brightness(110%)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            boxShadow: `
              inset 0 1.5px 0 0 rgba(255,255,255,0.2),
              inset 0 -1px 0 0 rgba(255,255,255,0.05),
              0 12px 40px -12px rgba(0,0,0,0.5)
            `,
          }}
        >
          
          {/* REFRAÇÃO NAS BORDAS (Chromatic) */}
          <div 
            className="absolute inset-0 rounded-[28px] pointer-events-none
                       overflow-hidden"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255,100,100,0.03) 0%, 
                  transparent 30%,
                  transparent 70%,
                  rgba(100,100,255,0.03) 100%)
              `,
            }}
          />
          
          {/* HIGHLIGHT SUPERIOR (linha de luz) */}
          <div 
            className="absolute inset-x-3 top-0 h-[1.5px] rounded-full
                       pointer-events-none"
            style={{
              background: `linear-gradient(90deg, 
                transparent 0%,
                rgba(255,255,255,0.6) 20%, 
                rgba(255,255,255,0.9) 50%,
                rgba(255,255,255,0.6) 80%,
                transparent 100%)`,
              boxShadow: '0 0 8px rgba(255,255,255,0.4)',
            }}
          />
          
          {/* SHEEN TOP (reflexo de luz superior) */}
          <div 
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-[28px]
                       pointer-events-none"
            style={{
              background: `linear-gradient(180deg, 
                rgba(255,255,255,0.10) 0%, 
                rgba(255,255,255,0.03) 50%,
                transparent 100%)`,
            }}
          />
                    
          {/* HIGHLIGHT INFERIOR (reflexo sutil) */}
          <div 
            className="absolute inset-x-6 bottom-[1px] h-px rounded-full
                       pointer-events-none"
            style={{
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255,255,255,0.3), 
                transparent)`,
            }}
          />
          
          {/* SIDE HIGHLIGHTS (refração lateral) */}
          <div 
            className="absolute inset-y-3 left-0 w-px rounded-full
                       pointer-events-none"
            style={{
              background: `linear-gradient(180deg, 
                transparent, 
                rgba(255,255,255,0.4), 
                transparent)`,
            }}
          />
          <div 
            className="absolute inset-y-3 right-0 w-px rounded-full
                       pointer-events-none"
            style={{
              background: `linear-gradient(180deg, 
                transparent, 
                rgba(255,255,255,0.4), 
                transparent)`,
            }}
          />
          
          {/* GLOW COLORIDO SEGUE O ATIVO */}
          <motion.div
            className="absolute inset-y-0 pointer-events-none
                       rounded-[28px] overflow-hidden"
            style={{
              width: `${100 / NAV_ITEMS.length}%`,
            }}
            animate={{
              left: `${(NAV_ITEMS.findIndex(i => i.id === currentTab) / NAV_ITEMS.length) * 100}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <div 
              className="absolute inset-0 blur-2xl opacity-40"
              style={{
                background: `radial-gradient(circle at center, 
                  rgba(${NAV_ITEMS.find(i => i.id === currentTab)?.glow || '255,255,255'},0.6) 0%, 
                  transparent 70%)`,
              }}
            />
          </motion.div>
          
          {/* ITEMS */}
          <div className="relative h-[64px]
                          flex items-center justify-around
                          px-1">
            
            {NAV_ITEMS.map((item) => {
              const isActive = currentTab === item.id;
              
              return (
                <NavLink
                  key={item.id}
                  to={item.path || '/'}
                  onClick={() => triggerHaptic()}
                  onMouseEnter={() => item.path && preloadRoute(item.path)}
                  onFocus={() => item.path && preloadRoute(item.path)}
                  onTouchStart={() => item.path && preloadRoute(item.path)}
                  className="relative flex-1 h-full
                             flex items-center justify-center no-underline"
                >
                  <motion.div
                    whileTap={{ scale: 0.90 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 17 
                    }}
                    className="relative flex flex-col items-center 
                               justify-center gap-0.5
                               h-11 w-[90%] rounded-2xl
                               px-1"
                  >
                    {/* PILL ATIVO LIQUID GLASS */}
                    {isActive && (
                      <>
                        {/* Glow externo */}
                        <motion.div
                          layoutId="navGlow"
                          className="absolute inset-x-0 inset-y-0 rounded-2xl blur-md"
                          style={{
                            background: `rgba(${item.glow},0.25)`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                        
                        {/* Pill glass colorido */}
                        <motion.div
                          layoutId="navPill"
                          className="absolute inset-0 rounded-2xl
                                     overflow-hidden"
                          style={{
                            background: `linear-gradient(180deg, 
                              rgba(${item.glow},0.25) 0%, 
                              rgba(${item.glow},0.12) 50%,
                              rgba(${item.glow},0.08) 100%)`,
                            border: `1px solid rgba(${item.glow},0.4)`,
                            boxShadow: `
                              inset 0 1px 0 rgba(255,255,255,0.2),
                              0 0 12px rgba(${item.glow},0.2)
                            `,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        >
                          {/* Shine top do pill */}
                          <div 
                            className="absolute inset-x-2 top-0 h-px"
                            style={{
                              background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)`,
                            }}
                          />
                          
                          {/* Inner gradient */}
                          <div 
                            className="absolute inset-0 h-1/2"
                            style={{
                              background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)`,
                            }}
                          />
                        </motion.div>
                      </>
                    )}
                    
                    {/* ÍCONE */}
                    <motion.div
                      className="relative z-10"
                      animate={{
                        scale: isActive ? 1.05 : 1,
                        y: isActive ? -1 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      }}
                    >
                      <item.icon
                        size={19}
                        strokeWidth={isActive ? 2.5 : 2}
                        style={{
                          color: isActive ? item.color : 'rgba(255,255,255,0.55)',
                          filter: isActive 
                            ? `drop-shadow(0 0 6px rgba(${item.glow},0.7))` 
                            : 'none',
                          transition: 'all 0.3s',
                        }}
                      />
                      
                      {/* Badge */}
                      {item.badge && (
                        <motion.span
                          className="absolute -top-0.5 -right-1
                                     w-2 h-2 rounded-full
                                     bg-red-500 border-2 border-black"
                          animate={{
                            scale: [1, 1.25, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          style={{
                            boxShadow: '0 0 8px rgba(239,68,68,0.6)',
                          }}
                        />
                      )}
                    </motion.div>
                    
                    {/* LABEL */}
                    <motion.span
                      className="relative z-10 
                                 text-[8px] font-bold 
                                 uppercase tracking-[0.08em]
                                 leading-none
                                 whitespace-nowrap"
                      style={{
                        color: isActive ? item.color : 'rgba(255,255,255,0.55)',
                        textShadow: isActive 
                          ? `0 0 6px rgba(${item.glow},0.5)` 
                          : 'none',
                        transition: 'all 0.3s',
                      }}
                      animate={{
                        opacity: isActive ? 1 : 0.7,
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }
