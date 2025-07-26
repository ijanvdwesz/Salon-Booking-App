import React from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';

// Declare static values outside the component to avoid re-creating on each render
const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -26.2041, // Johannesburg
  lng: 28.0473
};

const MAP_ID = 'b07920fc03afa33efe62f2a9';
const LIBRARIES = ['marker']; // keep static

function MapComponent() {
  const handleOnLoad = (map) => {
    if (
      window.google &&
      window.google.maps &&
      window.google.maps.marker &&
      window.google.maps.marker.AdvancedMarkerElement
    ) {
      new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: center,
        title: 'Glamour Beauty & Spa'
      });
    } else {
      console.warn("AdvancedMarkerElement API not available. Make sure 'libraries=marker' is loaded.");
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAosaqSJm5RVYOUSTclJpE0qT4GNSzsXOU"
      libraries={LIBRARIES}
      loadingStrategy="async" // recommended
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={handleOnLoad}
        options={{ mapId: MAP_ID }} // attach your Map ID here
      >
        {/* Marker is added via AdvancedMarkerElement in onLoad */}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
