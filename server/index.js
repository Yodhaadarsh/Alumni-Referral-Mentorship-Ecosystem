require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./db');

// Allowed browser origins: CLIENT_URL (comma separated) plus any localhost port for development
const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(s => s.trim());
const origin = (o, cb) => cb(null, !o || allowed.includes(o) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(o));

const app = express();
app.use(cors({ origin }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/alumni', require('./routes/alumni'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/public', require('./routes/public'));
app.get('/api/health', (_, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin } });
require('./socket')(io);

connectDB().then(async () => {
  await require('./seed')();
  const port = process.env.PORT || 5000;
  server.listen(port, () => console.log(`Server running on ${port}`));
}).catch(err => { console.error('Database error:', err.message); process.exit(1); });
