// Test script to verify WebSocket connection to our Edge Function
import WebSocket from 'ws';

const sessionId = `test-${Date.now()}`;
const wsUrl = `wss://cwvtwqesfioqysaafqvg.supabase.co/functions/v1/realtime-proxy?session=${encodeURIComponent(sessionId)}`;

console.log('Connecting to:', wsUrl);

const ws = new WebSocket(wsUrl);

ws.on('open', function open() {
  console.log('✓ Connected to proxy successfully!');

  // Send a test message
  ws.send(JSON.stringify({
    type: 'session.update',
    session: {
      type: 'realtime',
      instructions: 'You are a helpful assistant.'
    }
  }));
});

ws.on('message', function message(data) {
  console.log('Received:', data.toString());
});

ws.on('error', function error(err) {
  console.error('✗ WebSocket error:', err.message);
});

ws.on('close', function close(code, reason) {
  console.log('Connection closed:', code, reason?.toString());
  process.exit(code === 1000 ? 0 : 1);
});

// Close connection after 10 seconds
setTimeout(() => {
  console.log('Closing test connection...');
  ws.close();
}, 10000);