import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function SensorData() {
  const [sensorData, setSensorData] = useState([]); // Array para armazenar as leituras

  // Função para buscar dados do backend
  const fetchSensorData = async () => {
    try {
      const response = await fetch('/api/sensordata');
      const data = await response.json();
      setSensorData(data);
    } catch (error) {
      console.error('Erro ao buscar dados do sensor:', error);
    }
  };

  useEffect(() => {
    // Conectar ao broker MQTT
    const client = mqtt.connect('ws://192.168.0.100:9001'); // Usando WebSocket

    client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
      // Inscrever-se nos tópicos
      client.subscribe(['sensor/temperatura', 'sensor/umidade'], (err) => {
        if (err) {
          console.error('Erro ao se inscrever nos tópicos:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      const value = message.toString();
      const timestamp = new Date().toLocaleString();

      // Atualiza o estado com os dados recebidos do MQTT
      setSensorData((prevData) => {
        const latestEntry = prevData[prevData.length - 1] || { temperature: null, humidity: null, timestamp };

        // Atualiza os dados dependendo do tópico
        if (topic === 'sensor/temperatura') {
          return [...prevData, { ...latestEntry, temperature: value, timestamp }];
        }
        if (topic === 'sensor/umidade') {
          return [...prevData, { ...latestEntry, humidity: value, timestamp }];
        }
        return prevData;
      });
    });

    // Buscar dados de sensor ao montar o componente
    fetchSensorData();

    return () => {
      client.end(); // Desconectar do broker ao desmontar o componente
    };
  }, []); // O array vazio garante que o efeito só é executado uma vez

  return (
    <div>
      <h2>Leituras Recentes</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Temperatura (°C)</th>
            <th>Umidade (%)</th>
          </tr>
        </thead>
        <tbody>
          {sensorData.slice(-10).map((data, index) => ( // Exibir apenas as 10 leituras mais recentes
            <tr key={index}>
              <td>{data.timestamp}</td>
              <td>{data.temperature || '--'}</td>
              <td>{data.humidity || '--'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SensorData;

