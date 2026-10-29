const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const notify = require('./utils/notify');

// room id = the two user ids sorted and joined with "_"
module.exports = io => {
  io.use((socket, next) => {
    try { socket.userId = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET).id; next(); }
    catch { next(new Error('unauthorized')); }
  });

  io.on('connection', socket => {
    socket.on('join', room => room.split('_').includes(socket.userId) && socket.join(room));
    socket.on('message', async ({ room, text }) => {
      if (!socket.rooms.has(room) || !text?.trim()) return;
      const msg = await Message.create({ room, sender: socket.userId, text });
      io.to(room).emit('message', msg);
      const other = room.split('_').find(id => id !== socket.userId);
      notify(other, 'New message', text.slice(0, 80));
    });
  });
};
