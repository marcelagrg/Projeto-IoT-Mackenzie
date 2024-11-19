var mqtt = require('mqtt');
var options = {
    host: '192.168.0.100',
    port: 1883, // A porta padrão MQTT (não WebSocket)
    protocol: 'mqtt', // Usar MQTT em vez de WebSocket
};

var client = mqtt.connect(options);

// Ao conectar ao broker
client.on('connect', function () {
    console.log('Conectado ao broker MQTT');
    // Aqui você pode adicionar tópicos para subscrever ou publicar mensagens
    client.subscribe('esp32/sensordata', function (err) {
        if (!err) {
            console.log('Assinado no tópico!');
            client.publish('esp32/sensordata', 'Mensagem de teste');
        } else {
            console.log('Erro ao assinar no tópico:', err);
        }
    });
});

// Ao receber uma mensagem
client.on('message', function (topic, message) {
    // Exibe a mensagem recebida
    console.log('Mensagem recebida no tópico:', topic);
    console.log('Conteúdo da mensagem:', message.toString());
});
