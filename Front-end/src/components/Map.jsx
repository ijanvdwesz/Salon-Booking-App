import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -26.2041, // Example: Johannesburg
  lng: 28.0473
};

function MapComponent() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyAosaqSJm5RVYOUSTclJpE0qT4GNSzsXOU">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
