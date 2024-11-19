import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

function WebSocketComponent() {
  const [messages, setMessages] = useState([]); // Para armazenar as mensagens recebidas
  const [error, setError] = useState(''); // Para armazenar mensagens de erro

  useEffect(() => {
    // Conectar ao broker MQTT via WebSocket
    const client = mqtt.connect('ws://192.168.0.100:9001'); // WebSocket para MQTT

    client.on('connect', function () {
      console.log('Conectado ao broker MQTT');
      
      // Inscrição nos tópicos corretos
      client.subscribe('sensor/temperatura', function (err) {
        if (err) {
          console.log('Falha ao se inscrever no tópico "sensor/temperatura":', err);
          setError('Falha ao se inscrever no tópico "sensor/temperatura"');
        } else {
          console.log('Inscrição bem-sucedida no tópico "sensor/temperatura"');
        }
      });
    
      client.subscribe('sensor/umidade', function (err) {
        if (err) {
          console.log('Falha ao se inscrever no tópico "sensor/umidade":', err);
          setError('Falha ao se inscrever no tópico "sensor/umidade"');
        } else {
          console.log('Inscrição bem-sucedida no tópico "sensor/umidade"');
        }
      });
    });
    
    client.on('message', function (topic, message) {
      console.log('Mensagem recebida no tópico:', topic, 'Mensagem:', message.toString());
      
      // Adicionar nova mensagem ao estado para renderizar
      setMessages(prevMessages => [
        ...prevMessages,
        `${topic}: ${message.toString()}`
      ]);
    });
    
    client.on('error', function (err) {
      console.error('Erro ao conectar ao broker MQTT:', err);
      setError('Erro ao conectar ao broker MQTT');
    });
    
    // Cleanup ao desmontar o componente
    return () => {
      client.end(); // Encerra a conexão quando o componente for desmontado
    };
  }, []);

  return (
    <div>
      <h2>Bem-vindo ao Servidor IoT</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe mensagem de erro se houver */}
      <div>
        <h3>Mensagens Recebidas:</h3>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default WebSocketComponent;
