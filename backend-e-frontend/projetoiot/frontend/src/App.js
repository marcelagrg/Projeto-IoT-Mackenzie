import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css'; 


const App = () => {
  const [sensorData, setSensorData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  // Função para obter dados do backend
  const fetchSensorData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sensordata');
      const data = response.data;

      const temperatures = data.map(d => d.temperature);
      const humidities = data.map(d => d.humidity);
      const times = data.map(d => new Date(d.timestamp).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));

      setSensorData(data);
      setTemperatureData(temperatures.slice(-10));
      setHumidityData(humidities.slice(-10));
      setTimestamps(times.slice(-10));
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Atualiza os dados a cada 5 segundos
    return () => clearInterval(interval); 
  }, []);

  const tempChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: temperatureData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const humidityChartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Umidade (%)',
        data: humidityData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="app">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      <header className="header">
        <nav className="navbar">
          <ul>
            <li>
              <a href="/">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="/dashboard">
                <i className="fas fa-tachometer-alt"></i>
                <span>Painel</span>
              </a>
            </li>
            <li>
              <a href="/investors">
                <i className="fas fa-chart-line"></i>
                <span>Investidores</span>
              </a>
            </li>
            <li>
              <a href="/comunidade">
                <i className="fas fa-users"></i>
                <span>Comunidade</span>
              </a>
            </li>
            <li>
              <a href="/contact">
                <i className="fas fa-envelope"></i>
                <span>Contato</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <h1 className="title">Fábrica XYZ - Monitoramento de Sensores</h1>
      <h3 className="title">Sensor DHT22: Temperatura e Umidade</h3>
      <div className="charts-container">
        <div className="chart">
          <h3 className="chart-title">Temperatura</h3>
          <Line data={tempChartData} />
        </div>
        <div className="chart">
          <h3 className="chart-title">Umidade</h3>
          <Line data={humidityChartData} />
        </div>
      </div>
      <div className="table-container">
        <h3 className="table-title">Dados Recentes</h3>
        <table>
          <thead>
            <tr>
              <th>Temperatura (°C)</th>
              <th>Umidade (%)</th>
              <th>Horário</th>
            </tr>
          </thead>
          <tbody>
            {sensorData.slice(-10).map((data, index) => (
              <tr key={index}>
                <td>{data.temperature} °C</td>
                <td>{data.humidity} %</td>
                <td>{new Date(data.timestamp).toLocaleString('pt-BR', {
                  timeZone: 'America/Sao_Paulo',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <p>© 2024 Todos os direitos reservados.</p>
        <ul>
          <li><a href="/privacy">Política de Privacidade</a></li>
          <li><a href="/terms">Termos de Uso</a></li>
        </ul>
      </footer>
    </div>
  );
};

export default App;
