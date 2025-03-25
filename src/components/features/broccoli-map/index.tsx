"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { icon } from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap, Popup } from "react-leaflet";
import Control from "react-leaflet-custom-control";
import { Send, Layers2, Minus, Plus, Ban, School, LucideIcon, ShoppingCart, TreePine, Blocks, LandPlot, Shield, Info, Cannabis, HousePlug, Banknote, Phone } from "lucide-react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-geosearch/dist/geosearch.css";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { findNearestLayers } from '@/actions/osm';
import { MapNotification } from './notification';
import { BroccoliMapControlButton, CollapsibleBroccoliMapControlButton } from './control-button';
import { isWithinTimeRange } from './utils';
import { BroccoliMapSearch, BroccoliMapSearchItem } from './search';
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css"
import { GestureHandling } from "leaflet-gesture-handling";
import { Button } from '../../ui/button';
import { axiosPrivateInstance } from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { propertyActions } from "@/store/reducers/propertyReducer";

const BroccoliMarker = icon({
  iconUrl: "/assets/images/marker.svg",
  iconSize: [32, 32],
});

const BroccoliMarkerInvalid = icon({
  iconUrl: "/assets/images/marker_invalid.svg",
  iconSize: [32, 32],
});

const BroccoliMarkerInitial = icon({
  iconUrl: "/assets/images/marker_initial.svg",
  iconSize: [32, 32],
});

export type LayerType = 'consume' | 'cultivation';

export type BroccoliMapNearestLayer = {
  latitude: number;
  longitude: number;
  distance: number;
  name?: string;
}

export type BroccoliMapNearestLayers = {
  [layer: string]: BroccoliMapNearestLayer
}

export type BroccoliMapLayer = {
  name: string;
  label: string;
  nearest?: BroccoliMapNearestLayer;
}

export type BroccoliMapLayerForLegend = BroccoliMapLayer & {
  color: string;
  icon: LucideIcon;
}

export const MapController = () => {
  const map = useMap();

  useEffect(() => {
    map.addHandler("gestureHandling", GestureHandling);
    // @ts-expect-error typescript does not see additional handler here
    map.gestureHandling.enable();
  }, [map]);

  return null;
}

function getLayersByType(layerType: LayerType, isBetween7And20: boolean, nearestLayers: BroccoliMapNearestLayers = {}) {
  return layerType === 'consume' ? [{
    name: 'schools',
    label: 'Schulen',
    icon: School,
    nearest: nearestLayers['schools'],
    color: '#9747FF'
  },{
    name: 'playgrounds',
    label: 'Kinderspielplätze',
    icon: TreePine,
    nearest: nearestLayers['playgrounds'],
    color: '#4781FF'
  },{
    name: 'kids_and_youth_facilities',
    label: 'Kinder- & Jugendeinrichtungen',
    icon: Blocks,
    nearest: nearestLayers['kids_and_youth_facilities'],
    color: '#F0CB36'
  },{
    name: 'sports',
    label: 'Öffentliche Sportstätten',
    icon: LandPlot,
    nearest: nearestLayers['sports'],
    color: '#26AC35'
  },{
    name: 'social_clubs',
    label: 'Anbauvereinigungen',
    icon: Cannabis,
    nearest: nearestLayers['social_clubs'],
    color: '#686868'
  },{
    name: 'military',
    label: 'Militärische Bereiche',
    icon: Shield,
    nearest: nearestLayers['military'],
    color: '#9D7900'
  }, ...(isBetween7And20 ? [{
    icon: ShoppingCart,
    color: '#41ADCE',
    nearest: nearestLayers['pedestrian'],
    name: 'pedestrian',
    label: 'Fußgängerzonen'
  }, {
    icon: Ban,
    color: '#EF4444',
    name: 'consume_with_pedestrian_zones',
    label: 'Konsumverbotszonen'
  }] : [{
    icon: Ban,
    color: '#EF4444',
    name: 'consume',
    label: 'Konsumverbotszonen'
  }])] : [{
    name: 'schools',
    label: 'Schulen',
    icon: School,
    nearest: nearestLayers['schools'],
    color: '#9747FF'
  },{
    name: 'playgrounds',
    label: 'Kinderspielplätze',
    icon: TreePine,
    nearest: nearestLayers['playgrounds'],
    color: '#4781FF'
  },{
    name: 'kids_and_youth_facilities',
    label: 'Kinder- & Jugendeinrichtungen',
    icon: Blocks,
    nearest: nearestLayers['kids_and_youth_facilities'],
    color: '#F0CB36'
  },{
    name: 'military',
    label: 'Militärische Bereiche',
    icon: Shield,
    nearest: nearestLayers['military'],
    color: '#9D7900'
  },{
    icon: ShoppingCart,
    color: '#41ADCE',
    nearest: nearestLayers['pedestrian'],
    name: 'pedestrian',
    label: 'Fußgängerzonen'
  }, {
    icon: Ban,
    color: '#EF4444',
    name: 'cultivation',
    label: 'Anbau- & Abgabeverbotszonen'
  }];
}

const BroccoliMap: React.FC<{
  setSelectedLocation: Dispatch<SetStateAction<[number, number] | null>>;
}> = ({ setSelectedLocation }) => {
  const mapRef = useRef<L.Map>(null);
  const dispatch = useAppDispatch();
  const { property } = useAppSelector((state) => state.property);
  const [showInstructions, setShowInstructions] = useState(true);
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await axiosPrivateInstance
          .get("/broccoli/getAllProperties")
          .then((res) => res.data);

        dispatch(propertyActions.setProperty({ property: result.data }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const [layerType, setLayerType] = useState<LayerType>('consume');
  const [isInitial, setIsInitial] = useState(true);
  const [isBetween7And20, setIsBetween7And20] = useState(isWithinTimeRange(7, 20));
  const [nearestLayers, setNearestLayers] = useState<BroccoliMapNearestLayers>({});
  const layers = useMemo<Array<BroccoliMapLayer | BroccoliMapLayerForLegend>>(() => getLayersByType(layerType, isBetween7And20, nearestLayers), [layerType, isBetween7And20, nearestLayers]);
  const legendLayers = useMemo(() => layers.filter(l => Object.hasOwn(l, 'icon')) as Array<BroccoliMapLayerForLegend>, [layers]);
  const legendNearestLayers = useMemo(() => layers.filter(l => !!l.nearest && Object.hasOwn(l, 'color')) as Array<BroccoliMapLayer & {nearest: BroccoliMapNearestLayer; color: string}>, [layers]);
  const isLegit = useMemo(() => !!position && !legendNearestLayers?.length && !nearestLayers?.['miscellanous'], [position, legendNearestLayers, nearestLayers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBetween7And20(isWithinTimeRange(7, 20));
    }, 60000);

    async function checkAndUpdatePosition() {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
    
        if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                updatePosition([position.coords.latitude, position.coords.longitude], 18);
              },
              (error) => {
                console.error("Error getting location:", error);
              }
            );
          }
        } else {
          console.log('Location access denied by the user.');
        }
      } catch (error) {
        console.error('Permission check error:', error);
      }
    }

    checkAndUpdatePosition();
    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    async function updateLayers() {
      if (!position) {
        return;
      }

      const layers = getLayersByType(layerType, isBetween7And20, nearestLayers);
      try {
        await findNearestLayers(
          position,
          layers.map(l => l.name),
          layerType === 'consume' ? 100 : 200
        ).then(setNearestLayers);
      } catch(err) {
        console.error(`[BroccoliMap]: Error fetching nearest layers`, err);
      }
      setIsInitial(false);
    }

    updateLayers();
  }, [position, layerType, isBetween7And20]);

  const updatePosition = (position: [number, number], zoom?: number) => {
    setNearestLayers({});
    setIsInitial(true);
    setPosition(position);
    setSelectedLocation(position);
    setShowInstructions(false);

    mapRef.current?.setView(position, zoom || mapRef.current.getZoom());
  }

  const updateLayerType = (type: string) => {
    setIsInitial(true);
    setLayerType(type as LayerType);
  }

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updatePosition([position.coords.latitude, position.coords.longitude], 18);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const handleSearch = ({x, y, zoom}: BroccoliMapSearchItem) => {
    updatePosition([y, x], zoom);
  };

  // const handleMarkerClick = (data: any) => {
  //   console.log("OK", data);
  // };

  return (
    <MapContainer
      className="relative w-full h-full @container"
      ref={mapRef}
      center={[52.52, 13.405]}
      zoom={16}
      scrollWheelZoom={true}
      attributionControl={false}
      zoomControl={false}
      doubleClickZoom={false}
    >
      {showInstructions && <div 
        className="p-4 z-[1000] bg-black/50 flex flex-col gap-2 items-center justify-center absolute top-0 left-0 right-0 bottom-0"
        onClick={() => setShowInstructions(false)}>
        <span className="text-zinc-100 text-lg tablet:hidden">Um zu zoomen, nutze Strg/CMD und das Mausrad/Touchpad.</span>
        <span className="text-zinc-100 text-lg hidden tablet:block text-center">Nutze zwei Finger um die Karte zu verschieben und zu zoomen.</span>
        <Button>Verstanden</Button>
      </div>}
      <MapController />
      <MapNotification onClick={updatePosition} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {layers.map(({name}) => (
        <TileLayer
          key={name}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`${process.env.NEXT_PUBLIC_URL_OSM}/${name}/{z}/{x}/{y}.png`}
        />
      ))}
      <Control position="topright">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100"
              title="Zonenschicht auswählen"
              type="button"
            >
              <Layers2 size={20} color="black" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Zonenschicht auswählen</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={layerType} onValueChange={updateLayerType}>
              <DropdownMenuRadioItem value="consume">Konsumverbotszonen</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cultivation">Anbau- & Abgabeverbotszonen</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Control>
      <Control position="bottomright">
        <div className="flex flex-col gap-1">
          <button
            className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100"
            title="Aktuelle Position verwenden"
            type="button"
            onClick={handleLocate}
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-color-secondary size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"></path>
            </svg>
          </button>
          <button
            className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100"
            title="Reinzoomen"
            type="button"
            onClick={() => mapRef?.current?.zoomIn()}
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="text-color-secondary size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
            </svg>
          </button>
          <button
            className="flex size-8 items-center justify-center rounded border border-stone-100 bg-white shadow hover:bg-stone-100"
            title="Rauszoomen"
            type="button"
            onClick={() => mapRef?.current?.zoomOut()}
          >
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="text-color-secondary size-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
            </svg>
          </button>
        </div>
      </Control>
      <Control position="topleft">
        <BroccoliMapSearch onSelect={handleSearch} />
      </Control>
      <Control position='bottomleft'>
        <CollapsibleBroccoliMapControlButton collapsedIcon={Info}>
          <div className="flex flex-col gap-3 px-3 pb-3 text-zinc-900">
          {legendLayers.map(({label, icon: LayerIcon, color, nearest}: BroccoliMapLayerForLegend) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 font-normal text-sm">
                    <LayerIcon className="mt-[2px] opacity-80" size={15} color={color} />
                  <div className="flex-1 flex flex-col text-left">
                    <span className="font-medium">{label}</span>
                    {nearest?.name && <span className="text-xs">{nearest.name}</span>}
                </div>
                {!!nearest && <span className="text-zinc-400">{parseInt(nearest.distance.toString())}m</span>}
              </div>
            ))}
          </div>
        </CollapsibleBroccoliMapControlButton>
      </Control>
      {property.map(
        (e) =>
          e?.location && (
            <Marker
              key={e.id} // Assuming e.id is a unique identifier for each property
              // eventHandlers={{ click: () => handleMarkerClick(e as any) }}
              position={e.location}
              icon={
                isInitial
                  ? BroccoliMarkerInitial
                  : isLegit
                    ? BroccoliMarker
                    : BroccoliMarkerInvalid
              }
            >
              <Popup>
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    <div className="border bg-slate-500 p-2 rounded-full">
                      <HousePlug size={20} color="white" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-lg font-bold">{e.title?.length as number > 20 ? e.title?.slice(0, 20) + '...' : e.title}</div>
                      <div className="text-sm bg-slate-700 text-center text-white font-bold rounded w-12">{e.size}</div>
                    </div>
                  </div>
                  <div className="flex gap-5 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="border bg-slate-500 p-2 rounded-full">
                      <Banknote size={15} color="white" />
                    </div>
                    <div className="text-sm font-bold">€{e.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="border bg-slate-500 p-2 rounded-full">
                      <Phone size={15} color="white" />
                    </div>
                    <div className="text-sm font-bold">{e.phone}</div>
                    </div>
                    </div>
                </div>
                <div className="text-center mt-3 border border-slate-500 p-1 rounded-lg font-bold text-sm w-1/2 mx-auto cursor-pointer hover:bg-slate-100">Mehr Infos</div>
              </Popup>
            </Marker>
          )
      )}

      {position && (
        <Marker
          // eventHandlers={{ click: handleMarkerClick }}
          position={position}
          icon={BroccoliMarkerInvalid}
        />
      )}
      {position &&
        !!legendNearestLayers?.length &&
        legendNearestLayers.map(({ name, color, nearest }) => (
          <Polyline
            key={name}
            positions={[position, [nearest.latitude, nearest.longitude]]}
            color={color}
            weight={2}
            dashArray="5, 5"/>
        ))}
    </MapContainer>
  );
};

export default BroccoliMap;
