const mqtt = require('mqtt');
const cors = require('cors');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

// Dados em memória
let sensorData = [];

// Configuração do cliente MQTT
// Alterando para conexão TCP
const mqttClient = mqtt.connect('ws://192.168.0.100:9001'); // Porta 1883 para conexão TCP

mqttClient.on('connect', () => {
  console.log("Conectado ao broker MQTT");

  mqttClient.subscribe("esp32/sensordata", (err) => {
    if (err) {
      console.error("Erro ao se inscrever no tópico", err);
    } else {
      console.log("Inscrito no tópico 'esp32/sensordata'");
    }
  });
});

mqttClient.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  console.log('Dados recebidos do MQTT:', data); // Verifique o conteúdo da mensagem recebida

  // Armazenando dados em memória
  const timestamp = Date.now(); // Hora local no momento da recepção dos dados

  sensorData.push({
    temperature: data.temperature,
    humidity: data.humidity,
    timestamp: timestamp,
  });

  console.log('Dados armazenados:', sensorData);
});

// Rota para obter dados do sensor
app.get('/api/sensordata', (req, res) => {
  console.log('Dados atuais do sensor:', sensorData); // Log dos dados
  res.json(sensorData); // Retorna os dados armazenados
});

// Inicia o servidor HTTP
const server = app.listen(PORT, () => {
  console.log('Backend rodando na porta ' + PORT);
});