import React from 'react';
import './Statistiques.css'; // Asegúrate de tener tu archivo de estilos CSS adecuadamente configurado
import { Bar } from 'react-chartjs-2';

const getRandomTime = () => (Math.random() * (5 - 3) + 3).toFixed(2);

const Statistiques = () => {
  // Datos ficticios para los gráficos de barras individuales (fechas de la semana pasada)
  const labels = ['12 Juin', '13 Juin', '14 Juin', '15 Juin', '16 Juin', '17 Juin'];

  const dataConnexions = {
    labels: labels,
    datasets: [
      {
        label: 'Nombre de Connexions',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: [5, 7, 8, 6, 9, 10] // Données fictives de connexions
      }
    ]
  };

  const dataCommandes = {
    labels: labels,
    datasets: [
      {
        label: 'Nombre de Commandes',
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.6)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [3, 4, 2, 6, 8, 5] // Données fictives de commandes
      }
    ]
  };

  const dataProduits = {
    labels: labels,
    datasets: [
      {
        label: 'Nombre de Produits Ajoutés',
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54,162,235,0.6)',
        hoverBorderColor: 'rgba(54,162,235,1)',
        data: [2, 3, 4, 5, 6, 7] // Données fictives de produits ajoutés
      }
    ]
  };

  const dataGoogleStore = {
    labels: labels,
    datasets: [
      {
        label: 'Téléchargements Google Store',
        backgroundColor: 'rgba(255,206,86,0.4)',
        borderColor: 'rgba(255,206,86,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,206,86,0.6)',
        hoverBorderColor: 'rgba(255,206,86,1)',
        data: [1, 2, 3, 4, 5, 6] // Données fictives de téléchargements Google Store
      }
    ]
  };

  const dataAppleStore = {
    labels: labels,
    datasets: [
      {
        label: 'Téléchargements Apple Store',
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(153,102,255,0.6)',
        hoverBorderColor: 'rgba(153,102,255,1)',
        data: [4, 2, 3, 1, 5, 7] // Données fictives de téléchargements Apple Store
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  return (
    <div className='statistics'>
      <h3>Statistiques des Services</h3>

      <div className="chart-container">
        <div className="chart-item">
          <h4>Nombre de Connexions</h4>
          <Bar
            data={dataConnexions}
            options={options}
          />
          <p>Temps moyen par service : {getRandomTime()} minutes</p>
        </div>

        <div className="chart-item">
          <h4>Nombre de Commandes</h4>
          <Bar
            data={dataCommandes}
            options={options}
          />
          <p>Temps moyen par service : {getRandomTime()} minutes</p>
        </div>

        <div className="chart-item">
          <h4>Nombre de Produits Ajoutés</h4>
          <Bar
            data={dataProduits}
            options={options}
          />
          <p>Temps moyen par service : {getRandomTime()} minutes</p>
        </div>

        <div className="chart-item">
          <h4>Téléchargements Google Store</h4>
          <Bar
            data={dataGoogleStore}
            options={options}
          />
          <p>Temps moyen par service : {getRandomTime()} minutes</p>
        </div>

        <div className="chart-item">
          <h4>Téléchargements Apple Store</h4>
          <Bar
            data={dataAppleStore}
            options={options}
          />
          <p>Temps moyen par service : {getRandomTime()} minutes</p>
        </div>
      </div>
    </div>
  );
}

export default Statistiques;
