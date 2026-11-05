import { WebSocketServer } from 'ws';

const port = 8787;
const wss = new WebSocketServer({ port });
const clients = new Set();

function roster() {
  return [...clients].map((client) => client.name).filter(Boolean);
}

function broadcast(message) {
  const payload = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === 1) client.send(payload);
  }
}

wss.on('connection', (socket) => {
  clients.add(socket);
  socket.on('message', (raw) => {
    let data = {};
    try { data = JSON.parse(String(raw)); } catch { return; }
    if (data.type === 'join') {
      socket.name = String(data.name || 'Colleague').slice(0, 32);
      socket.room = data.room || 'floor-4';
      const names = roster();
      const insiderIndex = names.length > 1 ? Math.floor(Math.random() * names.length) : -1;
      broadcast({
        type: 'state',
        roster: names,
        note: names.length < 2 ? 'Waiting for a second player in this room. You are connected, and you are not in a match yet.' : `Live room has ${names.length} players. Roles are assigned on the server.`,
      });
      if (insiderIndex >= 0) {
        [...clients].forEach((client, index) => {
          if (client.readyState === 1) client.send(JSON.stringify({ type: 'role', role: index === insiderIndex ? 'insider' : 'employee', roster: names }));
        });
      }
    }
    if (data.type === 'chat' || data.type === 'vote') {
      broadcast({ type: data.type, from: socket.name, text: data.text, target: data.target, roster: roster() });
    }
  });
  socket.on('close', () => {
    clients.delete(socket);
    broadcast({ type: 'state', roster: roster(), note: 'A player left the local room.' });
  });
});

console.log(`SafeRon insider realtime listening on ws://127.0.0.1:${port}`);
