import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  Polygon,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { VANCOUVER_POSITION } from "constants";

const Map = ({ homeZone = [], windowZones = [], sunLine = [] }) => {
  const [activeZone, setActiveZone] = useState(null);

  const windowOptions = { stroke: false };
  const lineOptions = { weight: 1 };

  return (
    <MapContainer
      center={[VANCOUVER_POSITION.lat, VANCOUVER_POSITION.lon]}
      zoom={9}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {windowZones.map((zone) => (
        <Polygon
          key={zone?.geometry[0].lat}
          positions={zone.geometry}
          pathOptions={windowOptions}
          eventHandlers={{
            click: (e) => {
              setActiveZone(zone);
            },
          }}
        />
      ))}
      {homeZone.geometry && (
        <Polygon
          positions={homeZone.geometry}
          eventHandlers={{
            click: (e) => {
              setActiveZone(homeZone);
            },
          }}
        ></Polygon>
      )}
      <Polyline positions={sunLine} pathOptions={lineOptions}></Polyline>
      {activeZone && (
        <Popup
          position={[activeZone.geometry[0].lat, activeZone.geometry[0].lon]}
        >
          <div>
            {activeZone.data.cloudCover && (
              <p>Cloud cover - {parseInt(activeZone.data.cloudCover)}%</p>
            )}
            {activeZone.data.cloudBase && (
              <p>
                Cloud base -{" "}
                {Number.parseFloat(activeZone.data.cloudBase).toFixed(1)}km
              </p>
            )}
            {activeZone.data.cloudCeiling && (
              <p>
                Cloud ceiling -{" "}
                {Number.parseFloat(activeZone.data.cloudCeiling).toFixed(1)}km
              </p>
            )}
            {activeZone.data.visibility && (
              <p>Visibility - {parseInt(activeZone.data.visibility)}km</p>
            )}
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default Map;
