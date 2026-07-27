import { Link } from 'react-router-dom'
import { Stamp, ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-10">
          <ArrowLeft className="h-4 w-4" /> Retour au site
        </Link>
        <div className="flex items-center gap-2 mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <Stamp className="h-5 w-5 text-deep" />
          </span>
          <span className="font-display font-bold text-lg">Dossier Béton</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-8 tracking-tight">Conditions générales</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted leading-relaxed">
          <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Nature du produit</h2>
          <p>« Visa Schengen : Le Dossier Béton » est un guide numérique (documents, checklist, modèles) destiné à accompagner la préparation d'une demande de visa Schengen. Il s'agit d'un outil d'aide à la préparation et ne constitue ni un service officiel, ni une garantie d'obtention du visa. La décision finale appartient exclusivement aux autorités consulaires compétentes.</p>
          <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Livraison</h2>
          <p>L'accès au guide est délivré immédiatement après confirmation du paiement, via le lien fourni par notre prestataire de paiement.</p>
          <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Paiement</h2>
          <p>Le paiement est traité de manière sécurisée par notre prestataire (Chariow), via Mobile Money.</p>
          <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Support</h2>
          <p>Un support est disponible par WhatsApp pour toute question relative au contenu du guide.</p>
        </div>
      </div>
    </div>
  )
}
