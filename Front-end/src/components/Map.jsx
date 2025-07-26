import React from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -26.2041, // Johannesburg (example)
  lng: 28.0473
};

function MapComponent() {
  const handleOnLoad = (map) => {
    if (window.google && window.google.maps && window.google.maps.marker) {
      // Add AdvancedMarkerElement instead of Marker
      new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: center,
        title: 'Glamour Beauty & Spa'
      });
    } else {
      console.warn("AdvancedMarkerElement API not available. Check that 'libraries=marker' is loaded in your script URL.");
    }
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAosaqSJm5RVYOUSTclJpE0qT4GNSzsXOU"
      libraries={['marker']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={handleOnLoad}
      >
        {/* Removed <Marker /> */}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
