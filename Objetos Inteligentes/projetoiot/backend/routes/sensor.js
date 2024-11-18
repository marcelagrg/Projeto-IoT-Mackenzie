const cors = require('cors');
const sensorRoutes = require('./routes/sensordata'); // Certifique-se de que o caminho está correto para o arquivo sensor.js

const PORT = process.env.PORT || 3000;

// Middleware para permitir CORS e uso de JSON
app.use(cors());

// Rotas
app.use('/api', sensorRoutes); // Agora, o endpoint será acessível em '/api/sensor'

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
