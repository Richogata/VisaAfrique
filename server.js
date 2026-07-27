// Serveur Express — pensé pour Render.com (Web Service).
// Sert le build Vite (dist/) ET la route serveur pour la Conversions API Meta.
// Le jeton d'accès n'existe qu'ici, jamais dans le bundle envoyé au navigateur.

import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// --- Conversions API (Meta) ---------------------------------------------
app.post('/api/track-conversion', async (req, res) => {
  const PIXEL_ID = process.env.FB_PIXEL_ID
  const ACCESS_TOKEN = process.env.FB_CONVERSION_API_TOKEN

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error('FB_PIXEL_ID ou FB_CONVERSION_API_TOKEN manquant côté serveur')
    return res.status(500).json({ error: 'Configuration Facebook manquante côté serveur' })
  }

  try {
    const { event_name, event_id, event_source_url, custom_data } = req.body || {}

    if (!event_name) {
      return res.status(400).json({ error: 'event_name requis' })
    }

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id, // partagé avec fbq() côté navigateur pour la déduplication
          event_source_url,
          action_source: 'website',
          user_data: {
            client_user_agent: req.headers['user-agent'] || '',
            client_ip_address:
              (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
              req.socket?.remoteAddress ||
              '',
          },
          custom_data: custom_data || {},
        },
      ],
    }

    const fbRes = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    const data = await fbRes.json()

    if (!fbRes.ok) {
      console.error('Erreur Meta Conversions API:', data)
      return res.status(fbRes.status).json({ error: data })
    }

    return res.status(200).json({ success: true, data })
  } catch (err) {
    console.error('Erreur track-conversion:', err)
    return res.status(500).json({ error: 'Erreur interne' })
  }
})

// --- Fichiers statiques du build Vite -----------------------------------
app.use(express.static(path.join(__dirname, 'dist')))

// --- Fallback SPA : react-router gère le routing côté client ------------
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})
