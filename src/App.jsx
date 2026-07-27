import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Stamp,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ListChecks,
  FileText,
  Calculator,
  Building2,
  AlertTriangle,
  MessageCircle,
  Menu,
  X,
  Lock,
  CalendarCheck,
  MousePointer2,
  Check,
  Users,
  Wallet,
  XCircle,
  CreditCard,
  Smartphone,
  Timer,
  BadgeCheck,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// Lien de paiement — même produit, même prestataire (Chariow)
const CHECKOUT_URL = 'https://dkbqsfvk.mychariow.shop/prd_w2rs4x4u/checkout'

// Fin de l'offre de lancement — à ajuster selon la campagne en cours
const LAUNCH_DEADLINE = new Date('2026-08-10T23:59:59')

function trackEvent(eventName, params) {
  if (typeof window === 'undefined') return

  // event_id partagé entre le Pixel (navigateur) et la Conversions API (serveur)
  // pour que Meta déduplique les deux envois du même événement.
  const eventId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  // 1. Pixel navigateur
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params, { eventID: eventId })
  }

  // 2. Conversions API — envoyée depuis le serveur (voir /api/track-conversion.js),
  // plus fiable face aux bloqueurs de pub et à la limitation du tracking sur iOS.
  fetch('/api/track-conversion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: params,
    }),
  }).catch(() => {}) // échec silencieux : ne doit jamais bloquer l'UX
}

/* ----------------------------------------------------------------
   Contenu
---------------------------------------------------------------- */
const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil' },
  { label: 'Le problème', href: '#probleme' },
  { label: 'Contenu', href: '#contenu' },
  { label: 'Méthode', href: '#methode' },
  { label: 'Tarif', href: '#offre' },
]

const CONTENU = [
  { icon: ListChecks, title: 'Checklist complète des documents', text: "La liste exacte des pièces à réunir, dans l'ordre, sans rien oublier — le premier motif de refus évité." },
  { icon: FileText, title: 'Lettre de motivation modèle', text: "Une trame testée pour rédiger une lettre claire, cohérente et qui rassure l'agent consulaire." },
  { icon: Calculator, title: 'Simulateur de moyens financiers', text: "Calculez le montant à justifier selon la durée de séjour et évitez le refus pour « ressources insuffisantes »." },
  { icon: Building2, title: 'Modèles réservation & assurance', text: "Exemples de réservation d'hôtel et d'attestation d'assurance voyage conformes aux exigences Schengen." },
  { icon: AlertTriangle, title: 'Les erreurs qui causent le refus', text: "Le détail des erreurs les plus fréquentes commises par les candidats camerounais, sénégalais et togolais." },
  { icon: MessageCircle, title: 'Support par WhatsApp', text: "Une question en montant votre dossier ? Posez-la directement, on vous répond." },
]

const TRUST = [
  { icon: ShieldCheck, title: 'Critères officiels Schengen', text: "Le dossier suit strictement les exigences du code des visas de l'espace Schengen." },
  { icon: Clock, title: 'Mis à jour 2025', text: "Contenu revu pour refléter les pratiques consulaires les plus récentes." },
  { icon: Lock, title: 'Paiement sécurisé', text: "Règlement par Mobile Money, en toute sécurité, accès livré immédiatement après achat." },
]

const PROTOCOL = [
  { step: '01', title: 'Téléchargez le Dossier Béton', text: "Accès immédiat après paiement. Le guide complet, la checklist et tous les modèles arrivent directement sur votre téléphone.", bullets: ['Format PDF consultable sur mobile', 'Aucun logiciel à installer', 'Accès à vie au contenu'], img: 'https://images.unsplash.com/photo-1612365922929-eb3b5b4bddb0?auto=format&fit=crop&w=1200&q=80' },
  { step: '02', title: 'Suivez la checklist, point par point', text: "Cochez chaque document au fur et à mesure. La méthode élimine les oublis qui justifient 8 refus sur 10.", bullets: ['Ordre exact de constitution du dossier', 'Rien laissé au hasard', 'Adapté à votre motif de voyage'], img: 'https://images.unsplash.com/photo-1613244470504-4d0a17ce71d0?auto=format&fit=crop&w=1200&q=80' },
  { step: '03', title: 'Déposez un dossier inattaquable', text: "Vous vous présentez au consulat avec un dossier complet, cohérent et conforme — exactement ce que l'agent attend.", bullets: ['Lettre de motivation prête', 'Justificatifs financiers calculés', 'Confiance le jour du dépôt'], img: 'https://images.unsplash.com/photo-1553697388-94e804e2f0f6?auto=format&fit=crop&w=1200&q=80' },
]

const REFUS_STATS = [
  { pays: 'Cameroun', taux: '38%' },
  { pays: 'Sénégal', taux: '47%' },
  { pays: 'Togo', taux: '43%' },
]

const BONUSES = [
  { icon: ListChecks, tag: 'Inclus', title: 'Checklist 1 page', text: "À imprimer et emmener le jour de votre rendez-vous VFS. Vous cochez, vous déposez, vous attendez votre visa." },
  { icon: FileText, tag: 'Bonus 1', title: '3 modèles de lettres de motivation', text: "Visite familiale, affaires, tourisme. Vous remplacez juste votre prénom et votre ville — c'est prêt." },
  { icon: Calculator, tag: 'Bonus 2', title: 'Tableau calculateur financier', text: "Entrez votre nombre de jours de séjour, obtenez le montant exact à montrer sur votre compte — en euros et en FCFA." },
  { icon: Users, tag: 'Bonus 3 · limité', title: 'Groupe WhatsApp privé', text: "Réservé aux 50 premiers acheteurs. Posez vos questions directement, réponse sous 24h." },
]

const COMPARAISON = [
  { icon: XCircle, title: 'Agence informelle', price: '50 000 – 200 000 FCFA', note: 'Sans aucune garantie de résultat.', negative: true },
  { icon: BadgeCheck, title: 'Le Dossier Béton', price: '9 900 FCFA', note: 'Avec garantie satisfait ou remboursé 7 jours.', negative: false },
  { icon: Wallet, title: 'Un refus de visa', price: '90 000 FCFA perdus', note: "Ce guide coûte moins de 10% du prix d'un seul refus.", negative: true },
]

const PAIEMENTS = [
  { label: 'Orange Money', icon: Smartphone },
  { label: 'MTN Mobile Money', icon: Smartphone },
  { label: 'Wave', icon: Smartphone },
  { label: 'Carte bancaire', icon: CreditCard },
]

/* ----------------------------------------------------------------
   Navbar
---------------------------------------------------------------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg shadow-primary/10' : 'bg-transparent'} rounded-full px-4 sm:px-6 py-2.5 w-[calc(100%-2rem)] max-w-5xl`}>
        <div className="flex items-center justify-between gap-6">
          <a href="#accueil" className="flex items-center gap-2 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Stamp className="h-5 w-5 text-deep" strokeWidth={2.4} />
              <span className="absolute inset-0 rounded-full ring-2 ring-primary/30 group-hover:ring-primary/50 transition" />
            </span>
            <span className="font-display font-bold tracking-tight text-lg text-white transition-colors">Dossier Béton</span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium tracking-tight lift-on-hover text-white/80 hover:text-primary transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('InitiateCheckout', { content_name: 'Dossier Béton', value: 9900, currency: 'XOF' })}
            className="hidden lg:inline-flex magnetic-btn items-center gap-1.5 bg-primary text-deep px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-primary/30"
          >
            Commander — 9 900 FCFA
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </a>

          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-full text-white" aria-label="Ouvrir le menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] transition-all duration-500 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-deep/95 backdrop-blur-2xl" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 left-0 right-0 bg-background rounded-b-5xl px-6 pt-8 pb-12 transition-transform duration-500 border-b border-divider ${open ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex items-center justify-between mb-10">
            <span className="font-display font-bold text-xl text-ink">Dossier Béton</span>
            <button onClick={() => setOpen(false)} className="p-2 rounded-full bg-divider/40">
              <X className="h-5 w-5 text-ink" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-display text-2xl font-semibold text-ink py-3 border-b border-divider">
                {link.label}
              </a>
            ))}
          </div>
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => { setOpen(false); trackEvent('InitiateCheckout', { content_name: 'Dossier Béton', value: 9900, currency: 'XOF' }) }}
            className="mt-8 magnetic-btn flex items-center justify-center gap-2 bg-primary text-deep px-6 py-4 rounded-full font-bold w-full"
          >
            Commander — 9 900 FCFA
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------------------------------
   Hero
---------------------------------------------------------------- */
function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-line-1', { y: 40, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' })
      gsap.from('.hero-line-2', { y: 60, opacity: 0, duration: 1.2, delay: 0.5, ease: 'power3.out' })
      gsap.from('.hero-cta, .hero-meta', { y: 24, opacity: 0, duration: 0.8, delay: 0.8, stagger: 0.12, ease: 'power3.out' })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="accueil" ref={heroRef} className="relative min-h-[100dvh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1612365922929-eb3b5b4bddb0?auto=format&fit=crop&w=2000&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-[0.35]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-deep/90 via-deep/60 to-deep/85" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-deep to-transparent" />

      <div className="absolute top-24 right-6 sm:right-16 hidden sm:flex flex-col gap-6 z-10">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-primary animate-float" style={{ animationDelay: `${i * 1.1}s`, opacity: 0.7 - i * 0.15 }} />
        ))}
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-20 min-h-[100dvh] flex flex-col justify-end">
        <p className="hero-meta font-mono text-xs uppercase tracking-[0.25em] text-primary mb-6">
          Guide numérique — Cameroun · Sénégal · Togo
        </p>
        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.95] max-w-5xl text-balance">
          <span className="hero-line-1 block">Visa Schengen</span>
          <span className="hero-line-2 block font-serif italic font-medium text-primary-light">Le Dossier Béton</span>
        </h1>
        <p className="hero-meta mt-8 max-w-xl text-white/70 text-base sm:text-lg leading-relaxed">
          38% de refus au Cameroun. 47% au Sénégal. 43% au Togo. Dans la majorité des cas, ce n'est pas un manque de moyens — c'est un dossier mal monté. La méthode complète pour déposer un dossier que rien ne peut faire tomber.
        </p>
        <div className="hero-cta mt-10 flex flex-wrap gap-3">
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('InitiateCheckout', { content_name: 'Dossier Béton', value: 9900, currency: 'XOF' })}
            className="magnetic-btn inline-flex items-center gap-2 bg-primary text-deep px-6 py-3.5 rounded-full font-bold shadow-lg shadow-primary/30"
          >
            Je sécurise mon dossier — 9 900 FCFA
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a href="#contenu" className="magnetic-btn inline-flex items-center gap-2 glass-dark text-white px-6 py-3.5 rounded-full font-semibold border border-white/15">
            Voir ce qu'il contient
          </a>
        </div>
        <p className="hero-meta mt-6 text-xs text-white/40 font-mono">
          27 000 FCFA <span className="line-through">→</span> <span className="text-primary">9 900 FCFA</span> · offre de lancement · accès immédiat
        </p>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Features — 3 cartes interactives
---------------------------------------------------------------- */
function RefusShuffler() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % REFUS_STATS.length), 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="relative h-44 rounded-3xl bg-gradient-to-br from-deep to-surface border border-divider overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {REFUS_STATS.map((s, i) => {
          const offset = (i - active + REFUS_STATS.length) % REFUS_STATS.length
          const isFront = offset === 0
          return (
            <div
              key={s.pays}
              className="absolute transition-all duration-700 ease-out flex flex-col items-center"
              style={{
                transform: `scale(${isFront ? 1 : 1 - offset * 0.08}) translateY(${offset * 10}px)`,
                opacity: isFront ? 1 : 0.35 - offset * 0.08,
                filter: isFront ? 'none' : `blur(${offset * 1.5}px)`,
                zIndex: 10 - offset,
              }}
            >
              <span className="font-display text-5xl font-bold text-primary">{s.taux}</span>
              <span className="font-mono text-xs uppercase tracking-widest text-white/60 mt-2">{s.pays}</span>
            </div>
          )
        })}
      </div>
      <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/40">Taux de refus 2024</span>
    </div>
  )
}

function StampRain() {
  const [status, setStatus] = useState(0)
  const statuses = ['Analyse du dossier…', 'Points faibles détectés', 'Dossier béton prêt']
  useEffect(() => {
    const id = setInterval(() => setStatus((s) => (s + 1) % statuses.length), 2300)
    return () => clearInterval(id)
  }, [])
  const drops = [
    { left: '18%', delay: '0s', dur: '2.6s', size: 8 },
    { left: '32%', delay: '0.5s', dur: '2.2s', size: 6 },
    { left: '48%', delay: '1s', dur: '2.8s', size: 9 },
    { left: '62%', delay: '0.3s', dur: '2.4s', size: 7 },
    { left: '75%', delay: '1.3s', dur: '2.5s', size: 8 },
    { left: '55%', delay: '1.8s', dur: '2.3s', size: 5 },
    { left: '25%', delay: '2.1s', dur: '2.7s', size: 6 },
  ]
  return (
    <div className="relative h-44 rounded-3xl bg-gradient-to-b from-deep via-surface to-deep border border-divider overflow-hidden">
      <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
      <div className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
      <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-widest text-white/40 z-10">Vérification</span>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 h-3 w-16 rounded-sm bg-primary/70 z-10" />
      {drops.map((d, i) => (
        <span key={i} className="absolute top-8 rounded-[2px] bg-primary" style={{ left: d.left, width: d.size, height: d.size * 1.3, animation: `stamp-fall ${d.dur} ease-in ${d.delay} infinite` }} />
      ))}
      <svg className="absolute bottom-9 left-0 w-full" height="6" viewBox="0 0 300 6" preserveAspectRatio="none">
        <path d="M0 3 Q 75 0 150 3 T 300 3" stroke="rgba(201,163,78,0.35)" strokeWidth="1.5" fill="none" />
      </svg>
      {[20, 45, 68].map((left, i) => (
        <span key={i} className="absolute bottom-9 h-2 w-2 rounded-full border border-primary/50" style={{ left: `${left}%`, animation: `stamp-ripple 2.6s ease-out ${i * 0.8}s infinite` }} />
      ))}
      <div className="absolute bottom-0 inset-x-0 px-4 py-2.5 flex items-center gap-2 bg-black/40">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-[11px] text-white/70">{statuses[status]}</span>
      </div>
      <style>{`
        @keyframes stamp-fall { 0% { transform: translate(-50%, -10px); opacity: 0; } 12% { opacity: 1; } 82% { opacity: 1; } 100% { transform: translate(-50%, 95px); opacity: 0; } }
        @keyframes stamp-ripple { 0% { transform: translateX(-50%) scale(0.4); opacity: 0.9; } 80% { transform: translateX(-50%) scale(3.2); opacity: 0; } 100% { transform: translateX(-50%) scale(3.2); opacity: 0; } }
      `}</style>
    </div>
  )
}

function RdvScheduler() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 5), 1400)
    return () => clearInterval(id)
  }, [])
  const days = [3, 4, 5, 6, 7, 8, 9]
  const targetIndex = 4
  const cursorLeft = step >= 1 ? `${(targetIndex / (days.length - 1)) * 78 + 8}%` : '4%'
  const cursorTop = step >= 1 ? '58%' : '20%'
  const clicked = step >= 2
  const confirmed = step >= 3

  return (
    <div className="relative h-44 rounded-3xl bg-gradient-to-br from-surface to-deep border border-divider overflow-hidden p-4">
      <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">Dépôt du dossier</span>
      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((d, i) => (
          <div key={d} className={`h-8 rounded-md flex items-center justify-center text-[11px] font-mono transition-colors ${i === targetIndex && clicked ? 'bg-primary text-deep font-bold' : 'bg-white/5 text-white/50'}`}>
            {d}
          </div>
        ))}
      </div>
      <MousePointer2 className="absolute h-4 w-4 text-primary transition-all duration-700 ease-out z-10" style={{ left: cursorLeft, top: cursorTop }} />
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
        {confirmed ? (
          <>
            <CalendarCheck className="h-4 w-4 text-primary" />
            <span className="font-mono text-[11px] text-white/70">RDV consulat confirmé</span>
          </>
        ) : (
          <span className="font-mono text-[11px] text-white/40">Sélection de la date de dépôt…</span>
        )}
      </div>
    </div>
  )
}

function Features() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', { scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true }, y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="probleme" ref={ref} className="relative py-28 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">Le constat</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tighter max-w-2xl text-balance">
          La majorité des refus ne viennent pas d'un manque de dossier, mais d'un <span className="font-serif italic text-primary">mauvais dossier</span>.
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-14">
          <div className="feature-card rounded-3xl bg-surface border border-divider p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">01 — Le risque</p>
            <h3 className="font-display text-xl font-bold text-ink mb-5">Le taux de refus par pays</h3>
            <RefusShuffler />
            <p className="mt-5 text-sm text-muted leading-relaxed">Selon les statistiques 2024, près d'un dossier sur deux est refusé au Sénégal, et plus d'un sur trois au Cameroun et au Togo.</p>
          </div>
          <div className="feature-card rounded-3xl bg-surface border border-divider p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">02 — La méthode</p>
            <h3 className="font-display text-xl font-bold text-ink mb-5">Le dossier passé au crible</h3>
            <StampRain />
            <p className="mt-5 text-sm text-muted leading-relaxed">Chaque document est vérifié selon les critères réels d'évaluation utilisés par les agents consulaires.</p>
          </div>
          <div className="feature-card rounded-3xl bg-surface border border-divider p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">03 — Le résultat</p>
            <h3 className="font-display text-xl font-bold text-ink mb-5">Un dépôt serein</h3>
            <RdvScheduler />
            <p className="mt-5 text-sm text-muted leading-relaxed">Vous vous présentez au consulat avec un dossier complet, sans zone d'ombre, sans improvisation.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Pillars
---------------------------------------------------------------- */
function CountUp({ end, suffix = '', prefix = '', duration = 1800 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTs = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - startTs) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(end * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{value.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

function Pillars() {
  return (
    <section className="relative py-28 bg-background overflow-hidden">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-3 lg:divide-x divide-divider gap-10 lg:gap-0">
        {[
          { n: 47, suffix: '%', label: 'Taux de refus au Sénégal en 2024 — le problème que ce dossier cible directement.' },
          { n: 9900, suffix: '', label: 'FCFA en offre de lancement, au lieu de 27 000 FCFA.' },
          { n: 100, suffix: '%', label: "Contenu aligné sur les critères officiels de l'espace Schengen." },
        ].map((p, i) => (
          <div key={i} className="lg:px-10 first:lg:pl-0 last:lg:pr-0">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">{['Le problème', 'Le prix', 'La fiabilité'][i]}</p>
            <div className="font-display text-5xl sm:text-6xl font-bold text-primary">
              <CountUp end={p.n} suffix={p.suffix} />
            </div>
            <div className="relative mt-4 h-px bg-divider overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent" style={{ animation: 'pillar-sweep 3s ease-in-out infinite' }} />
            </div>
            <p className="mt-4 text-sm text-muted leading-relaxed max-w-xs">{p.label}</p>
          </div>
        ))}
      </div>
      <style>{`@keyframes pillar-sweep { 0% { transform: translateX(-100%); } 50% { transform: translateX(400%); } 100% { transform: translateX(400%); } }`}</style>
    </section>
  )
}

/* ----------------------------------------------------------------
   Protocol — sticky stack
---------------------------------------------------------------- */
function Protocol() {
  const cardRefs = useRef([])
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card || i === PROTOCOL.length - 1) return
        gsap.to(card, {
          scrollTrigger: { trigger: card, start: 'top top+=100', end: '+=500', scrub: 1 },
          scale: 0.92,
          filter: 'blur(6px) saturate(0.7)',
          opacity: 0.5,
          ease: 'none',
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section id="methode" className="relative bg-background py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-16">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">La méthode</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tighter max-w-2xl text-balance">
          Trois étapes entre vous et un <span className="font-serif italic text-primary">dossier béton</span>.
        </h2>
      </div>
      <div className="relative" style={{ minHeight: `${PROTOCOL.length * 100}vh` }}>
        {PROTOCOL.map((p, i) => (
          <div key={p.step} ref={(el) => (cardRefs.current[i] = el)} className="sticky top-24 mb-6" style={{ zIndex: i + 1 }}>
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
              <div className="rounded-4xl bg-surface border border-divider grid lg:grid-cols-5 overflow-hidden shadow-xl shadow-black/40">
                <div className="lg:col-span-3 p-8 sm:p-12 flex flex-col justify-center">
                  <span className="font-display text-6xl font-bold text-primary/25 mb-4">{p.step}</span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-4 tracking-tight">{p.title}</h3>
                  <p className="text-muted leading-relaxed mb-6">{p.text}</p>
                  <ul className="space-y-2.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm text-ink/80">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-2 relative min-h-[220px]">
                  <img src={p.img} alt="" className="absolute inset-0 h-full w-full object-cover brightness-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/60 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Contenu du dossier
---------------------------------------------------------------- */
function ContenuGrid() {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.svc-tile', { scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true }, y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contenu" ref={ref} className="bg-deep text-white py-28 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-14">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">Le contenu</p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter max-w-2xl text-balance">
          Tout ce qu'il faut, <span className="font-serif italic text-primary-light">rien de superflu</span>.
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
        {CONTENU.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.title} className="svc-tile group bg-deep p-8 sm:p-10 hover:bg-white/[0.03] transition-colors">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 mb-6 group-hover:scale-110 transition-transform">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="font-display text-xl font-semibold mb-2.5">{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{s.text}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Bonuses
---------------------------------------------------------------- */
function BonusesSection() {
  return (
    <section className="py-28 bg-background">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-xl mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">Ce que vous recevez</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tighter text-balance">
            Livré immédiatement, <span className="font-serif italic text-primary">rien à attendre</span>.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {BONUSES.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="rounded-3xl bg-surface border border-divider p-7 sm:p-8 lift-on-hover transition-all">
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary bg-primary/10 border border-primary/25 rounded-full px-2.5 py-1">{b.tag}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-ink mb-2">{b.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{b.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Comparaison
---------------------------------------------------------------- */
function ComparisonSection() {
  return (
    <section className="py-28 bg-surface">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">Comparaison</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tighter text-balance">
            Ce que coûte <span className="font-serif italic text-primary">chaque option</span>.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {COMPARAISON.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className={`rounded-3xl p-8 border ${c.negative ? 'bg-background border-divider' : 'bg-primary/10 border-primary/40 shadow-lg shadow-primary/10 scale-[1.03]'}`}>
                <Icon className={`h-6 w-6 mb-5 ${c.negative ? 'text-white/30' : 'text-primary'}`} />
                <h3 className="font-display text-base font-semibold text-ink mb-2">{c.title}</h3>
                <p className={`font-display text-2xl font-bold mb-3 ${c.negative ? 'text-white/50' : 'text-primary'}`}>{c.price}</p>
                <p className="text-sm text-muted leading-relaxed">{c.note}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Garantie
---------------------------------------------------------------- */
function GuaranteeSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="rounded-4xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/25 p-8 sm:p-12 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 mb-6">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tighter mb-4">Garantie totale — 7 jours</h2>
          <p className="text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Vous achetez, vous lisez. Si vous pensez que ce guide ne vaut pas chaque franc payé, envoyez-nous un message. Nous vous remboursons intégralement — sans question, sans délai. Nous prenons le risque à votre place.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   TrustSignals
---------------------------------------------------------------- */
function TrustSignals() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(true), { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="garanties" ref={ref} className="py-28 bg-background">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-3 gap-6">
          {TRUST.map((t, i) => {
            const Icon = t.icon
            return (
              <div key={t.title} className={`bg-surface rounded-2xl p-7 border border-divider shadow-lg shadow-black/20 lift-on-hover transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: `${i * 120}ms` }}>
                <Icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-display font-semibold text-ink mb-2">{t.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{t.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Countdown
---------------------------------------------------------------- */
function getTimeLeft() {
  const diff = LAUNCH_DEADLINE.getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true }
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
    done: false,
  }
}

function Countdown() {
  const [t, setT] = useState(getTimeLeft())
  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  const units = [
    { label: 'Jours', value: t.d },
    { label: 'Heures', value: t.h },
    { label: 'Min', value: t.m },
    { label: 'Sec', value: t.s },
  ]

  return (
    <div className="inline-flex flex-col items-center gap-3 mb-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/25 px-4 py-1.5">
        <Timer className="h-3.5 w-3.5 text-primary" />
        <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
          {t.done ? "L'offre de lancement est terminée" : 'Le prix augmente dans'}
        </span>
      </div>
      {!t.done && (
        <div className="flex items-center gap-2 sm:gap-3">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center justify-center bg-surface border border-divider rounded-2xl w-16 sm:w-20 py-3">
              <span className="font-display text-2xl sm:text-3xl font-bold text-ink tabular-nums">{String(u.value).padStart(2, '0')}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted mt-1">{u.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ----------------------------------------------------------------
   Pricing / CTA
---------------------------------------------------------------- */
function PricingCTA() {
  return (
    <section id="offre" className="relative py-28 sm:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative max-w-4xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-3">L'offre</p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tighter text-balance">
            Un dossier béton pour <span className="font-serif italic text-primary">moins qu'un dîner</span>.
          </h2>
        </div>

        <div className="rounded-4xl bg-surface border border-primary/25 shadow-2xl shadow-primary/10 p-8 sm:p-14 text-center">
          <Countdown />
          <p className="text-muted text-sm mb-2 line-through">15 000 FCFA</p>
          <p className="font-display text-6xl sm:text-7xl font-bold text-primary tracking-tighter mb-2">
            9 900 <span className="text-2xl align-top">FCFA</span>
          </p>
          <p className="font-mono text-xs text-white/40 mb-8">Après l'offre de lancement : 15 000 FCFA</p>

          <ul className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto mb-10">
            {[
              'Le guide complet — 22 pages',
              'Bonus — Checklist 1 page à imprimer',
              'Bonus — 3 modèles de lettres de motivation',
              'Bonus — Tableau calculateur financier',
              'Bonus — Accès groupe WhatsApp privé',
              'Garantie satisfait ou remboursé 7 jours',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-ink/85">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('InitiateCheckout', { content_name: 'Dossier Béton', value: 9900, currency: 'XOF' })}
            className="magnetic-btn inline-flex items-center justify-center gap-2 bg-primary text-deep px-10 py-4 rounded-full font-bold text-base shadow-lg shadow-primary/30 w-full sm:w-auto"
          >
            Acheter maintenant — avant l'augmentation
            <ArrowRight className="h-4 w-4" />
          </a>
          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted font-mono">
            <Lock className="h-3.5 w-3.5" /> Paiement sécurisé · Livraison immédiate sur WhatsApp et par email
          </p>

          <div className="mt-8 pt-8 border-t border-divider flex flex-wrap items-center justify-center gap-3">
            {PAIEMENTS.map((p) => {
              const Icon = p.icon
              return (
                <span key={p.label} className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] border border-divider px-3.5 py-1.5 text-xs text-white/60 font-mono">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {p.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Footer
---------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="bg-deep text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-5 gap-12 pb-14">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Stamp className="h-5 w-5 text-deep" />
              </span>
              <span className="font-display font-bold text-lg">Dossier Béton</span>
            </div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-6">
              Le guide numérique pour monter un dossier de visa Schengen solide, conforme et prêt à être déposé — pensé pour les candidats camerounais, sénégalais et togolais.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary ring-pulse" />
              <span className="font-mono text-xs text-white/50">Livraison immédiate après achat</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              Édité par SkyBridge Voyages — Montréal, Canada
              <br />
              <a href="mailto:hello@skybridgevoyages.ca" className="hover:text-primary transition-colors">hello@skybridgevoyages.ca</a>
              {' · '}
              <a href="https://wa.me/15145551234" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp +1 514 555 1234</a>
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Le guide</p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><a href="#contenu" className="hover:text-primary transition-colors">Contenu</a></li>
                <li><a href="#methode" className="hover:text-primary transition-colors">Méthode</a></li>
                <li><a href="#offre" className="hover:text-primary transition-colors">Tarif</a></li>
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Légal</p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><a href="/privacy" className="hover:text-primary transition-colors">Confidentialité</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors">Conditions</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} SkyBridge Voyages. Tous droits réservés.</p>
          <p className="text-white/30 text-xs font-mono">Ce guide est un outil d'aide à la préparation ; il ne garantit pas la délivrance du visa.</p>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------------------------------------
   App
---------------------------------------------------------------- */
export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pillars />
        <Protocol />
        <ContenuGrid />
        <BonusesSection />
        <ComparisonSection />
        <TrustSignals />
        <GuaranteeSection />
        <PricingCTA />
      </main>
      <Footer />
    </div>
  )
}
