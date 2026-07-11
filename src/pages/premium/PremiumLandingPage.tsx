import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Crown,
  Sparkles,
  Shield,
  Lock,
  Zap,
  Star,
  ChevronLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedButton, Badge, GlassCard } from '../../components/UI';
import { PAYMENT_CONFIG } from '../../config/payment';
import { aiPremiumCopy } from '../../lib/productDisclosure';
import { trackPremiumEvent } from '../../lib/premiumAnalytics';
import type { BillingPeriod, PlanTier } from '../../services/paymentService';
import { clsx } from 'clsx';

const formatBrl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });

export interface PremiumLandingPageProps {
  onBack?: () => void;
}

const COMPARE_ROWS: { label: string; free: string; premium: string; supremo: string }[] = [
  {
    label: 'IA no app (ATHENA, trilhas, correções e demais)',
    free: 'Preview / limites',
    premium: 'Completo',
    supremo: 'Completo + prioridade',
  },
  { label: 'Mapas mentais', free: 'Limitado', premium: 'Ilimitado', supremo: 'Ilimitado + prioridade' },
  { label: 'Simulados', free: '—', premium: 'Ilimitados', supremo: 'Ilimitados + análise IA' },
  { label: 'Trilhas com IA', free: '1', premium: 'Ilimitadas', supremo: 'Ilimitadas' },
  { label: 'Duelo Socrático', free: 'Preview', premium: 'Completo', supremo: 'Completo' },
  { label: 'Treino estratégico', free: '—', premium: 'Sim', supremo: 'Sim' },
  { label: 'Histórico', free: 'Básico', premium: 'Ilimitado', supremo: 'Ilimitado' },
  { label: 'Suporte', free: 'Comunidade', premium: 'Prioritário', supremo: 'Prioritário' },
  { label: 'Modo offline', free: '—', premium: 'Premium+', supremo: 'Premium+' },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim. Sem fidelidade forçada pelo app: você gerencia renovação e cancelamento nas **Google Play** ou **App Store**, conforme as regras da loja, quando o app nativo estiver publicado.',
  },
  {
    q: 'Funciona offline?',
    a: 'Parte do conteúdo sincronizado pode ser acessado sem rede após carregar; recursos que dependem de IA exigem conexão.',
  },
  {
    q: 'Tem reembolso?',
    a: 'Política de garantia será publicada no checkout oficial. Nesta versão demo o pagamento é simulado.',
  },
  {
    q: 'Posso compartilhar a conta?',
    a: 'Uma conta é para uso individual. Compartilhar pode violar os termos e afetar personalização da IA.',
  },
  {
    q: 'Como funciona a IA?',
    a: 'A ATHENA e as demais funções com modelo usam IA para tutorar, corrigir redações e sugerir trilhas. O uso completo desses recursos (sem o teto do Free) está nos planos Premium e Supremo; no Free há preview ou cotas menores.',
  },
  {
    q: 'Quais formas de pagamento?',
    a: 'Em produção: pagamento pela Google Play e Apple App Store (métodos aceitos por cada loja). Na web, o checkout pode ser só demonstração até o app nas lojas.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Marina L.',
    exam: 'Medicina · USP 2025',
    quote: 'A IA me poupou horas em revisão. Vale cada centavo.',
    stars: 5,
  },
  {
    name: 'Pedro H.',
    exam: 'ENEM · Nota 1000 em CH',
    quote: 'Simulados + trilhas fecharam minhas lacunas em matemática.',
    stars: 5,
  },
  {
    name: 'Ana C.',
    exam: 'ITA · Aprovada',
    quote: 'Visual premium e fluxo focado — parece app de gente grande.',
    stars: 5,
  },
];

export function PremiumLandingPage({ onBack }: PremiumLandingPageProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [period, setPeriod] = useState<BillingPeriod>('monthly');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [tIndex, setTIndex] = useState(0);

  const { premium, supremo } = PAYMENT_CONFIG;

  useEffect(() => {
    trackPremiumEvent('premium_page_viewed', { path: '/premium' });
    const prevTitle = document.title;
    document.title = 'Athena Premium — Eleve seus estudos ao próximo nível';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      'content',
      'Premium e Supremo: uso completo de toda a IA do app e das ferramentas com modelo. Simulados, trilhas e demais benefícios Athena.'
    );
    return () => {
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setTIndex((i) => (i + 1) % TESTIMONIALS.length), 5200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const prices = useMemo(() => {
    const pm = premium.priceMonthly;
    const py = premium.priceYearly / 12;
    const sm = supremo.priceMonthly;
    const sy = supremo.priceYearly / 12;
    return {
      premiumDisplay: period === 'monthly' ? pm : py,
      premiumBilled: period === 'monthly' ? pm : premium.priceYearly,
      supremoDisplay: period === 'monthly' ? sm : sy,
      supremoBilled: period === 'monthly' ? sm : supremo.priceYearly,
    };
  }, [period, premium.priceMonthly, premium.priceYearly, supremo.priceMonthly, supremo.priceYearly]);

  const goCheckout = (plan: PlanTier) => {
    trackPremiumEvent('premium_plan_clicked', { plan, period });
    navigate('/premium/checkout', { state: { plan, period } });
  };

  const particles = useMemo(
    () =>
      Array.from({ length: reduceMotion ? 0 : 16 }, (_, i) => ({
        id: i,
        left: `${(i * 7 + 13) % 100}%`,
        delay: (i % 5) * 0.4,
        dur: 8 + (i % 4) * 2,
      })),
    [reduceMotion]
  );

  return (
    <div className="min-h-screen bg-[#050808] text-white pb-32 overflow-x-hidden">
      {/* Aurora + grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute -inset-[40%] opacity-60"
          animate={
            reduceMotion
              ? {}
              : {
                  background: [
                    'radial-gradient(ellipse at 20% 20%, rgba(0,255,136,0.25), transparent 55%)',
                    'radial-gradient(ellipse at 80% 30%, rgba(34,211,238,0.2), transparent 50%)',
                    'radial-gradient(ellipse at 50% 80%, rgba(139,92,246,0.18), transparent 55%)',
                    'radial-gradient(ellipse at 20% 20%, rgba(0,255,136,0.25), transparent 55%)',
                  ],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          style={{ filter: 'blur(40px)' }}
        />
        <div className="absolute inset-0 tech-grid opacity-[0.12]" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{ left: p.left, top: '110%' }}
            animate={reduceMotion ? {} : { y: ['0vh', '-130vh'], opacity: [0, 0.8, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10">
        <header className="flex items-center justify-between gap-4 mb-10 md:mb-14">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors"
                aria-label="Voltar"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary/90">Athena</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono uppercase tracking-widest">
            <Shield size={12} className="text-primary/60" />
            Pagamento seguro
          </div>
        </header>

        {/* HERO */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-20 md:mb-28">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge variant="primary" className="text-[9px] tracking-[0.25em]">
              <Sparkles size={10} className="inline mr-1" />
              Premium
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
              Eleve seus estudos ao{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-violet-400">
                próximo nível
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/55 max-w-xl leading-relaxed">
              {aiPremiumCopy.full} Além disso: simulados completos, trilhas personalizadas e fluxo premium — sem ruído, sem
              atalho visual.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <AnimatedButton
                onClick={() => goCheckout('premium')}
                className="py-4 px-8 rounded-2xl bg-primary text-black font-bold border-primary shadow-[0_0_40px_rgba(0,255,136,0.25)] text-sm uppercase tracking-widest"
                glow
              >
                Começar agora
                <ArrowRight size={18} className="ml-2 inline" />
              </AnimatedButton>
              <button
                type="button"
                onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
                className="py-4 px-6 rounded-2xl border border-white/15 text-sm font-bold uppercase tracking-widest text-white/70 hover:bg-white/5 transition-colors"
              >
                Ver planos
              </button>
            </div>
            <p className="pt-4 text-xs text-white/45">
              Evolua no seu ritmo com ferramentas de estudo, revisão e acompanhamento.
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <motion.div
              className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-6 md:p-8 shadow-2xl backdrop-blur-xl"
              whileHover={reduceMotion ? {} : { y: -4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div className="absolute -top-3 -right-3 w-24 h-24 bg-primary/20 blur-3xl rounded-full" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-4">Preview do app</p>
              <div className="aspect-[4/3] rounded-2xl bg-black/50 border border-white/10 flex flex-col overflow-hidden">
                <div className="h-9 border-b border-white/10 flex items-center px-3 gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                  <span className="w-2 h-2 rounded-full bg-primary/80" />
                </div>
                <div className="flex-1 p-4 space-y-3">
                  <div className="h-3 w-1/3 rounded-full bg-white/10" />
                  <div className="h-2 w-full rounded-full bg-white/5" />
                  <div className="h-2 w-5/6 rounded-full bg-white/5" />
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <div className="h-20 rounded-xl bg-primary/10 border border-primary/20" />
                    <div className="h-20 rounded-xl bg-cyan-500/10 border border-cyan-500/20" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-white/35 mt-4 text-center font-mono">Mockup ilustrativo · lazy-friendly</p>
            </motion.div>
          </motion.div>
        </section>

        {/* COMPARISON */}
        <section className="mb-20 md:mb-28">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Free × Premium × Supremo</h2>
          </div>
          <GlassCard className="overflow-hidden border-white/10 bg-black/30">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-white/40">Recurso</th>
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-white/50">Free</th>
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-primary">Premium</th>
                    <th className="p-4 font-mono text-[10px] uppercase tracking-widest text-amber-300/90">Supremo</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-white/80 font-medium">{row.label}</td>
                      <td className="p-4 text-white/45">{row.free}</td>
                      <td className="p-4 text-primary/90 font-semibold">{row.premium}</td>
                      <td className="p-4 text-amber-200/90">{row.supremo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
          <p className="text-[10px] text-white/30 mt-3 font-mono uppercase tracking-widest text-center">
            Roadmap de updates contínuos na área logada
          </p>
        </section>

        {/* PRICING */}
        <section id="planos" className="mb-20 md:mb-28 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Planos</h2>
              <p className="text-white/45 text-sm max-w-md">Escolha o ritmo. Anual economiza tempo e dinheiro.</p>
            </div>
            <div
              className="inline-flex rounded-2xl border border-white/10 p-1 bg-black/40"
              role="group"
              aria-label="Período de cobrança"
            >
              {(['monthly', 'yearly'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={clsx(
                    'px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all',
                    period === p ? 'bg-primary text-black' : 'text-white/50 hover:text-white'
                  )}
                >
                  {p === 'monthly' ? 'Mensal' : 'Anual'}
                  {p === 'yearly' && (
                    <span className="ml-2 text-[9px] opacity-80">−17%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free */}
            <GlassCard className="p-6 flex flex-col border-white/10 bg-white/[0.02]">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2">Free</p>
              <p className="text-3xl font-black mb-1">{formatBrl(0)}</p>
              <p className="text-xs text-white/40 mb-6">Pra experimentar</p>
              <ul className="space-y-3 flex-1 text-sm text-white/60">
                <li className="flex gap-2">
                  <Check size={16} className="text-primary shrink-0 mt-0.5" /> Questões e explorar
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-primary shrink-0 mt-0.5" /> IA só em preview / com limites; Premium
                  libera tudo
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="text-primary shrink-0 mt-0.5" /> Flashcards com limites
                </li>
              </ul>
              <button
                type="button"
                disabled
                className="mt-6 w-full py-3 rounded-xl border border-white/10 text-white/35 text-xs font-bold uppercase tracking-widest cursor-default"
              >
                Plano atual
              </button>
            </GlassCard>

            {/* Premium highlight */}
            <motion.div
              className="relative rounded-3xl p-[1px] bg-gradient-to-br from-primary via-cyan-400 to-violet-500 shadow-[0_0_50px_rgba(0,255,136,0.15)]"
              whileHover={reduceMotion ? {} : { scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              <GlassCard className="p-6 h-full flex flex-col border-0 bg-[#070c0a] rounded-[22px]">
                <Badge variant="primary" className="self-start text-[9px] mb-3">
                  Mais popular
                </Badge>
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">Premium</p>
                <p className="text-3xl font-black mb-0.5">
                  {formatBrl(prices.premiumDisplay)}
                  <span className="text-sm font-semibold text-white/40">/mês</span>
                </p>
                {period === 'yearly' && (
                  <p className="text-[11px] text-white/40 mb-4">
                    Cobrado {formatBrl(prices.premiumBilled)} /ano
                  </p>
                )}
                {period === 'monthly' && <p className="text-xs text-white/40 mb-4">Cobrança mensal</p>}
                <ul className="space-y-3 flex-1 text-sm text-white/75">
                  <li className="flex gap-2">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" /> IA completa: ATHENA e todas as
                    ferramentas com modelo
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" /> Simulados e trilhas sem limite do Free
                  </li>
                  <li className="flex gap-2">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" /> Suporte prioritário
                  </li>
                </ul>
                <AnimatedButton
                  onClick={() => goCheckout('premium')}
                  className="mt-6 w-full py-4 rounded-xl bg-primary text-black font-bold border-primary text-xs uppercase tracking-widest"
                  glow
                >
                  Assinar Premium
                </AnimatedButton>
              </GlassCard>
            </motion.div>

            {/* Supremo */}
            <GlassCard className="p-6 flex flex-col border-amber-500/25 bg-amber-500/[0.04]">
              <Badge variant="orange" className="self-start text-[9px] mb-3">
                Best value anual
              </Badge>
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-200/80 mb-2">Supremo</p>
              <p className="text-3xl font-black mb-0.5">
                {formatBrl(prices.supremoDisplay)}
                <span className="text-sm font-semibold text-white/40">/mês</span>
              </p>
              {period === 'yearly' ? (
                <p className="text-[11px] text-white/40 mb-4">
                  Cobrado {formatBrl(prices.supremoBilled)} /ano · economize vs mensal
                </p>
              ) : (
                <p className="text-xs text-white/40 mb-4">Ou anual com vantagem</p>
              )}
              <ul className="space-y-3 flex-1 text-sm text-white/75">
                <li className="flex gap-2">
                  <Crown size={16} className="text-amber-400 shrink-0 mt-0.5" /> Tudo do Premium
                </li>
                <li className="flex gap-2">
                  <Zap size={16} className="text-amber-400 shrink-0 mt-0.5" /> Fila prioritária IA &amp; insights
                </li>
                <li className="flex gap-2">
                  <Star size={16} className="text-amber-400 shrink-0 mt-0.5" /> Benefícios exclusivos em roadmap
                </li>
              </ul>
              <AnimatedButton
                onClick={() => goCheckout('supremo')}
                variant="secondary"
                className="mt-6 w-full py-4 rounded-xl border-amber-500/40 bg-amber-500/10 text-amber-200 font-bold text-xs uppercase tracking-widest hover:bg-amber-500/20"
              >
                Assinar Supremo
              </AnimatedButton>
            </GlassCard>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mb-20 md:mb-28">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Star className="text-amber-400" size={20} />
            Depoimentos
          </h2>
          <p className="text-[10px] text-white/35 font-mono mb-4 uppercase tracking-widest">
            {/* TODO: substituir por dados reais / UGC moderado */}
            Placeholder — métricas reais em breve
          </p>
          <div className="relative">
            <GlassCard className="p-8 md:p-10 border-white/10 min-h-[200px] flex flex-col justify-center">
              <motion.div
                key={tIndex}
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: TESTIMONIALS[tIndex].stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-lg md:text-xl text-white/90 italic leading-relaxed mb-6">
                  “{TESTIMONIALS[tIndex].quote}”
                </p>
                <p className="text-sm font-bold text-primary">{TESTIMONIALS[tIndex].name}</p>
                <p className="text-xs text-white/45">{TESTIMONIALS[tIndex].exam}</p>
              </motion.div>
            </GlassCard>
            <div className="flex justify-center gap-2 mt-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Depoimento ${i + 1}`}
                  onClick={() => setTIndex(i)}
                  className={clsx(
                    'w-2 h-2 rounded-full transition-all',
                    i === tIndex ? 'bg-primary w-6' : 'bg-white/20 hover:bg-white/40'
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20 md:mb-24 max-w-3xl">
          <h2 className="text-xl font-bold mb-6">FAQ</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => {
              const open = faqOpen === i;
              return (
                <GlassCard key={item.q} className="border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-sm text-white/90">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={clsx('text-white/40 shrink-0 transition-transform', open && 'rotate-180')}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-white/55 leading-relaxed">{item.a}</p>
                  </motion.div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center mb-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-10 md:p-14"
          >
            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">
              Pronto pra mudar seus estudos pra sempre?
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-lg mx-auto">
              Cancele quando quiser nas lojas. Transparência no fluxo oficial Play / App Store quando o app estiver publicado.
            </p>
            <AnimatedButton
              onClick={() => goCheckout('premium')}
              className="py-5 px-10 rounded-2xl bg-primary text-black font-black border-primary text-sm uppercase tracking-[0.2em] shadow-[0_0_48px_rgba(0,255,136,0.3)]"
              glow
            >
              Começar agora
            </AnimatedButton>
          </motion.div>
        </section>

        {/* TRUST */}
        <footer className="border-t border-white/10 pt-10 pb-6 text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono uppercase tracking-widest text-white/35">
            <span className="flex items-center gap-2">
              <Lock size={12} className="text-primary/70" /> Dados criptografados
            </span>
            <span className="flex items-center gap-2">
              <Shield size={12} className="text-primary/70" /> Cobrança pelas lojas oficiais (em produção)
            </span>
            <span>Google Play · App Store — billing nativo</span>
          </div>
          <p className="text-[10px] text-white/25">© {new Date().getFullYear()} Athena · Brasil</p>
        </footer>
      </div>
    </div>
  );
}
