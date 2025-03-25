"use client";

import { useState, useEffect, useRef } from "react";
import { icon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const ICON = icon({
  iconUrl: "/assets/images/maker.svg",
  iconSize: [32, 32],
});

const ProfileMap = ({
  latLng,
  maker,
}: {
  latLng: any;
  maker: boolean;
}) => {
  const [key, setKey] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [mapType, setMapType] = useState<'default' | 'satellite'>('default');
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [latLng]);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const toggleMapType = () => {
    setMapType(prev => prev === 'default' ? 'satellite' : 'default');
  };

  return (
    <div className="h-[480px] w-full overflow-hidden rounded-lg border border-stone-100">
      <div className="relative size-full">
        {!isInteractive && (
          <button 
            className="pointer-events-all group absolute inset-0 z-[9000] flex size-full items-center justify-center transition-colors hover:bg-black/40" 
            type="button"
            onClick={() => setIsInteractive(true)}
          >
            <div className="rounded-md bg-black/70 p-2 text-base text-white opacity-0 transition-opacity group-hover:opacity-100">
              Klicken zum interagieren
            </div>
          </button>
        )}
        <div className="size-full leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom" style={{ height: '100%', width: '100%', position: 'relative' }} tabIndex={0}>
          <MapContainer
            key={key}
            className="size-full"
            center={latLng}
            zoom={12}
            scrollWheelZoom={isInteractive}
            attributionControl={true}
            zoomControl={false}
            ref={mapRef}
          >
            <TileLayer
              url={mapType === 'default' 
                ? "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
                : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }
              attribution={mapType === 'default'
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                : '&copy; <a href="https://www.esri.com">Esri</a>'
              }
            />
            {maker && <Marker position={latLng} icon={ICON} />}
          </MapContainer>
        </div>
        <div className="absolute left-4 top-4 z-[2999] flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <button 
              className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100" 
              title="Reinzoomen" 
              type="button"
              onClick={handleZoomIn}
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="text-color-secondary size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
              </svg>
            </button>
            <button 
              className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100" 
              title="Rauszoomen" 
              type="button"
              onClick={handleZoomOut}
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="text-color-secondary size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="absolute right-4 top-4 z-[2999] flex flex-col gap-2">
          <button 
            className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100" 
            title="Kartentyp wechseln" 
            type="button"
            onClick={toggleMapType}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" className="text-color-secondary size-4">
              <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z"></path>
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div className="absolute bottom-8 right-4 z-[2999]">
          <button className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100" title="Aktuelle Position verwenden" type="button">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-4 text-color-secondary" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMap;
