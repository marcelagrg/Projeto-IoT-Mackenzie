const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true }); // `noServer: true` para usar com Express

wss.on('connection', ws => {
  console.log('Cliente conectado');
  setInterval(() => {
    const sensorData = { temperature: 25, humidity: 50 }; // Exemplo de dados
    ws.send(JSON.stringify(sensorData));
  }, 5000); // Envia os dados a cada 5 segundos
});
