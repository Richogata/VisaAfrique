import { Link } from 'react-router-dom'
import { Stamp, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
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
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-8 tracking-tight">Politique de confidentialité</h1>
        <div className="prose prose-invert max-w-none space-y-6 text-muted leading-relaxed">
          <p>Cette page décrit, de manière générale, comment les informations transmises lors de votre visite et de votre achat sont traitées.</p>
          <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Données collectées</h2>
          <p>Lors d'un achat, le traitement du paiement est assuré par notre prestataire de paiement (Chariow). Nous ne stockons aucune donnée bancaire sur ce site.</p>
          <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Utilisation des données</h2>
          <p>Les informations transmises via WhatsApp pour le support servent uniquement à répondre à vos questions concernant le produit acheté.</p>
          <h2 className="font-display text-xl font-semibold text-ink mt-8 mb-3">Contact</h2>
          <p>Pour toute question relative à vos données, contactez-nous via le support WhatsApp indiqué après votre achat.</p>
        </div>
      </div>
    </div>
  )
}
