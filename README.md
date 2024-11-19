# Projeto de Monitoramento IoT com MQTT
Este repositório contém o código-fonte de um sistema de monitoramento de temperatura e umidade integrado a uma interface web interativa. O principal objetivo do projeto é possibilitar o monitoramento em tempo real de máquinas industriais, promovendo maior eficiência e confibabilidade. Além disso, a solução foi projetada para facilitar a integração de micro e pequenas empresas no mercado global, permitindo que investidores e parceiros estratégicos acessem e analisem os dados coletados, incentivando colaborações e oportunidades de crescimento.

## Funcionamento
O projeto foi construído utilizando a Placa de desenvolvimento ESP32-DevKitC V4 e o sensor de temperatura e umidade DHT22. Além disso, foi utilizado um transistor BC547 e um LED difuso, quando inicia-se a leitura do sensor, o transistor é acionado para acender o LED por 2 segundos, transmitindo uma resposta visual da leitura dos dados. O código do ESP32 foi desenvolvido na plataforma Arduino IDE.
A comunicação foi feita a partir do protocolo MQTT e foi utilizado o MQTT Broker Mosquitto para o envio de dados. O backend, desenvolvido em node.js, é responsável por receber, manipular e enviar esses dados ao frontend, desenvolvido em React. Para garantir uma atualização em tempo real da interface, foi implementado o protocolo WebSockets.


## Descrição
### Componentes:
- Sensor DHT22.
- Microcontrolador ESP32.
- Broker MQTT (Mosquitto).
- Interface gráfica (frontend React.js).

### Interações:
- O sensor coleta dados e transmite ao ESP32.
- O ESP32 publica os dados no broker MQTT.
- O backend coleta os dados do broker MQTT e os envia ao frontend.


## Funcionamento
### Configuração e Inicialização:
•	O ESP32 é conectado ao dispositivo a partir de uma fonte de 5V;
•	O Arduino IDE é utilizado para compilar e transferir o código para o ESP32;
•	São configurados os pinos de entrada e saída. Um pino de entrada é utilizado para ler sinais externos, como os sinais recebidos por um sensor. O pino de dados do DHT22 (DATA) está conectado a um pino GPIO do ESP32, que foi configurado para funcionar como entrada. Essa conexão permite que o ESP32 efetue a leitura da temperatura e umidade emitidas pelo sensor. Um pino configurado como saída é utilizado para controlar dispositivos externos, nesse caso são controlados o LED e o transistor.

### Leitura do Sensor:
•	A cada 5 segundos, o ESP32 ativa o sensor DHT22 para coletar dados de temperatura e umidade.
•	Durante a leitura, o ESP32 aciona o transístor que acende o LED, mantendo-o aceso por 2 segundos. Após esse tempo o Led permanece 5 segundos desligado até a nova medição.

### Envio dos Dados Coletados:
•	O ESP32 publica os dados no tópico “esp32/sensordata” do broker MQTT. O broker utilizado é o Mosquitto.

### Integração com o Frontend
•	A interface do usuário, desenvolvida em React.js, coleta os dados diretamente do MQTT Broker e exibe esses valores de forma gráfica, permitindo o monitoramento em tempo real.


## Uso
Para rodar o projeto:
- Clone o repositório: `### git clone https://github.com/usuario/repositorio.git`
- Instale as dependências:
- Backend (Node.js): `### npm install`
- Frontend (React): `### npm install`
- Suba o servidor MQTT e o backend localmente.
- Acesse a aplicação no navegador: `### http://localhost:3000`
