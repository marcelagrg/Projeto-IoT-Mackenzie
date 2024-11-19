const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true }); 

wss.on('connection', ws => {
  console.log('Cliente conectado');
  
  ws.on('message', data => {
    console.log('Recebido do cliente:', data);
  });
});
