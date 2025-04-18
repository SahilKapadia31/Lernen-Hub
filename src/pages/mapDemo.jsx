import React, { useState, useRef, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Context } from "../context/Context_provider";

// Fix marker icon issue
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapDemo = () => {
  let { setgroup_visible, setstudylist_visible, setcourse_visible } = useContext(Context);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const markerRefs = useRef({}); // Store references to markers

  const locations = [
    {
      id: 1,
      lat: 50.778904255973856, // Aachen
      lng: 6.080215113372039,
      title: "University Library I RWTH",
      host: "University Library I RWTH",
      description: "University Library I RWTH",
    },
    {
      id: 2,
      lat: 50.777015615001694, // Koblenz
      lng: 6.077860865041824,
      title: "Frankenne GmbH",
      host: "Frankenne GmbH",
      description: "Frankenne GmbH",
    },
    {
      id: 3,
      lat: 50.77357061294069, // Rostock
      lng: 6.0872414980314336,
      title: "Deniz Kebap Haus",
      host: "Deniz Kebap Haus",
      description: "Deniz Kebap Haus",
    }
  ];

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    if (markerRefs.current[location.id]) {
      markerRefs.current[location.id].openPopup();
    }
  };

  return (
    <div className="container mt-4" onClick={() => { setcourse_visible(false); setgroup_visible(false); setstudylist_visible(false) }} >
      {/* Map and Locations */}
      <div className="row">
        {/* Location List */}
        <div className="col-md-6 overflow-auto mb-5 mb-lg-0" style={{ height: '500px' }}>
          <div className="row">
            {locations.map((location) => (
              <div key={location.id} className="col-md-12 mb-2" onClick={() => handleMarkerClick(location)}>
                <div className="card w-100">
                  <div className="card-body d-flex gap-2">
                    <div style={{ height: '100px', width: '100px', objectFit: 'cover' }}>
                      <img src={'https://img.freepik.com/premium-vector/campus-collage-university-education-logo-design-template_7492-65.jpg'} className="card-img-top" alt={location.title} />
                    </div>
                    <div>
                      <h5 className="card-title">{location.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{location.host}</h6>
                      <p className="card-text">{location.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="col-md-6">
          <MapContainer center={[50.778904255973856, 6.080215113372039]} zoom={15} style={{ height: "500px", width: "100%", zIndex: 3 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={customIcon}
                ref={(el) => markerRefs.current[location.id] = el} // Store marker reference
                eventHandlers={{
                  click: () => handleMarkerClick(location),
                }}
              >
                <Popup className="custom-popup">
                  <div className="popup-card">
                    <div className="popup-content">
                      <h6>{location.title}</h6>
                    </div>
                  </div>
                  {selectedLocation?.id === location.id && (
                    <div className="selected-location">
                      <strong>Selected Location:</strong> {selectedLocation.title}
                    </div>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapDemo;
