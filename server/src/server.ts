import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { setupSocketHandlers } from './sockets/socketHandler.js';
import { generateControllerQRCode } from './utils/qrGenerator.js';
import { supabaseService } from './services/supabaseClient.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

const fastify = Fastify({
  logger: {
    level: 'info'
  }
});

// Enable CORS for frontend clients
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok', service: 'GunLink Backend Server', time: new Date().toISOString() };
});

// QR Code generation API
fastify.get<{ Querystring: { room: string; host?: string } }>('/api/qrcode', async (request, reply) => {
  const { room, host } = request.query;
  if (!room) {
    return reply.status(400).send({ error: 'Room parameter is required' });
  }

  const clientHost = host || request.headers.referer || 'http://localhost:5173';
  const cleanHost = clientHost.replace(/\/$/, '');

  try {
    const qrDataUrl = await generateControllerQRCode(cleanHost, room);
    return { qrCode: qrDataUrl, room, targetUrl: `${cleanHost}/#/controller?room=${room}` };
  } catch (err) {
    return reply.status(500).send({ error: 'Failed to generate QR code' });
  }
});

// Leaderboard API endpoint
fastify.get('/api/leaderboard', async () => {
  const scores = await supabaseService.getTopScores(15);
  return { leaderboard: scores };
});

// Create Node server & attach Socket.IO
const server = fastify.server;
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingInterval: 10000,
  pingTimeout: 5000
});

setupSocketHandlers(io);

// Start Fastify server
try {
  await fastify.listen({ port: PORT, host: HOST });
  console.log(`
======================================================
🔫  GUNLINK FASTIFY & SOCKET.IO SERVER READY  🔫
======================================================
  ➜ Server listening on: http://${HOST}:${PORT}
  ➜ Socket.IO endpoint: ws://${HOST}:${PORT}
  ➜ QR API: http://${HOST}:${PORT}/api/qrcode?room=DEMO
======================================================
  `);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
