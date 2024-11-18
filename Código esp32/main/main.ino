#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// Configuração do Wi-Fi
const char* ssid = "Ecgrigolon2.4";
const char* password = "MilkLindo0135";

// Configurações do broker MQTT
const char* mqttServer = "192.168.0.100"; // IP do broker MQTT
const int mqttPort = 1883;

// Configuração dos tópicos MQTT
const char* sensorTopic = "esp32/sensordata";

// Configuração do sensor DHT
#define DHTPIN 15          // GPIO onde o DHT22 está conectado
#define DHTTYPE DHT22      // Tipo de sensor
DHT dht(DHTPIN, DHTTYPE);

// Configuração do LED/transistor
#define TRANSISTOR_PIN 4   // GPIO onde o pino base do transistor está conectado

WiFiClient wifiClient;
PubSubClient client(wifiClient);

// Função para conectar ao MQTT
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Conectando ao MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("Conectado ao broker MQTT!");
    } else {
      Serial.print("Falha na conexão. Código de erro: ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  // Conexão ao Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectado ao Wi-Fi!");

  // Atraso para garantir que a conexão Wi-Fi esteja estável
  delay(1000);

  // Configuração do broker MQTT
  client.setServer(mqttServer, mqttPort);

  // Inicialização do sensor DHT
  dht.begin();
}

void loop() {
  // Verifica a conexão com o MQTT
  if (!client.connected()) {
    reconnectMQTT();
  }
  client.loop();

  // Lê os dados do sensor DHT22
  float temperatura = dht.readTemperature();
  float umidade = dht.readHumidity();

  if (!isnan(temperatura) && !isnan(umidade)) {
    // Indicação visual da leitura (LED/transistor)
    digitalWrite(TRANSISTOR_PIN, HIGH); // Liga o LED
    Serial.println("LED ligado - realizando leitura");
    delay(2000); // Mantém o LED ligado por 2 segundos
    digitalWrite(TRANSISTOR_PIN, LOW);  // Desliga o LED
    Serial.println("LED desligado");

    // Criar o payload JSON com os dados
    String payload = "{\"temperature\": " + String(temperatura, 2) + 
                     ", \"humidity\": " + String(umidade, 2) + "}";

    // Publica os dados no tópico 'esp32/sensordata'
    client.publish(sensorTopic, payload.c_str());
    Serial.println("Dados publicados: " + payload);

    // Log dos dados no monitor serial
    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.println(" °C");
    Serial.print("Umidade: ");
    Serial.print(umidade);
    Serial.println(" %");
  } else {
    Serial.println("Falha ao ler do sensor DHT!");
  }

  delay(5000); // Aguarda 5 segundos antes da próxima leitura
}

