import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 48.8566,
  lng: 2.3522
};

const parisMarker = {
  lat: 48.8566,
  lng: 2.3522
};

const AppDownload = () => {
  const handlePlayStoreClick = () => {
    window.location.href = 'http://localhost:5175/';
  };

  return (
    <div className='app-download' id='app-download'>
      <h2>Best delivery website in  <span className="highlight">Paris</span></h2> 
      <div className="app-download-map">
        <LoadScript googleMapsApiKey="***************">
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            <Marker position={parisMarker} />
          </GoogleMap>
        </LoadScript>
      </div>
     
      {/* YouTube Video Embed */}
      <div className="youtube-video">
        <h3> <span className="highlight">Jokes</span> with our  <span className="highlight">Delivery</span></h3>
        <iframe
          width="100%" // Ajustement pour occuper toute la largeur de la page
          height="315" 
          src="https://www.youtube.com/embed/DnpiE18eek0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <p>Better Experience ? <br />Download <span className="highlight">CESI Eats</span></p>
      <div className="app-download-platforms">
        <img
          src={assets.play_store}
          alt="Play Store"
          onClick={handlePlayStoreClick}
          style={{ cursor: 'pointer' }}
        />
        <img
          src={assets.app_store}
          alt="App Store"
        />
      </div>

    </div>
  );
};

export default AppDownload;
