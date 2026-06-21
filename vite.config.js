import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Plugin giả lập API serverless cục bộ cho Vite khi dev
const apiServerlessProxyPlugin = () => ({
  name: 'api-serverless-proxy',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/ai' && req.method === 'POST') {
        try {
          // Tải động biến môi trường từ .env
          const envPath = path.resolve(process.cwd(), '.env');
          if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
              const parts = line.trim().split('=');
              if (parts.length >= 2 && !line.trim().startsWith('#')) {
                process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
              }
            });
          }

          // Đọc body request
          let bodyChar = '';
          req.on('data', chunk => {
            bodyChar += chunk;
          });

          req.on('end', async () => {
            let body = {};
            try {
              if (bodyChar) body = JSON.parse(bodyChar);
            } catch (e) {}

            // Giả lập Request và Response cho Handler
            const mockReq = {
              method: req.method,
              body: body
            };

            let statusCode = 200;
            const mockRes = {
              status(code) {
                statusCode = code;
                return this;
              },
              json(data) {
                res.writeHead(statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
                return this;
              }
            };

            // Import động handler từ api/ai.js sử dụng absolute path (phù hợp Windows/POSIX)
            const handlerPath = path.resolve(process.cwd(), 'api/ai.js').replace(/\\/g, '/');
            const aiHandlerModule = await import(`file:///${handlerPath}`);
            const handler = aiHandlerModule.default;
            await handler(mockReq, mockRes);
          });
        } catch (error) {
          console.error('[Vite Proxy Plugin] Error:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Serverless API dev proxy error: ' + error.message }));
        }
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiServerlessProxyPlugin()],
})

