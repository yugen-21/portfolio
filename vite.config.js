import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { clientIp, fileStore, handleFeed } from './server/catFeeds.js'

// Serves /api/feed-cat from a local JSON file under `npm run dev` and
// `npm run preview`; on Vercel the same route is api/feed-cat.js.
const catFeedApi = () => {
  const store = fileStore(path.resolve('.data/cat-feeds.json'))
  const middleware = async (req, res) => {
    try {
      const { status, body } = await handleFeed({
        method: req.method,
        ip: clientIp(req.headers, req.socket.remoteAddress),
        store,
        salt: 'local-dev',
      })
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(body))
    } catch {
      res.statusCode = 500
      res.end(JSON.stringify({ error: 'Counter unavailable' }))
    }
  }
  return {
    name: 'cat-feed-api',
    configureServer: (server) => { server.middlewares.use('/api/feed-cat', middleware) },
    configurePreviewServer: (server) => { server.middlewares.use('/api/feed-cat', middleware) },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), catFeedApi()],
})
