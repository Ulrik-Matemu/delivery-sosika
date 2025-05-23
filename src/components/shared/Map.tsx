import React, { useEffect, useState, useCallback } from 'react';
import Map, { Source, Layer, Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import { Phone, MapPin, Clock, Route, Eye, EyeOff } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { checkOrderStatus } from '@/services/order-status';

interface Coordinates {
  x: number;
  y: number;
}

interface DeliveryMapProps {
  origin: Coordinates;
  destination: Coordinates;
  userLocation: Coordinates | null;
  phoneNumber: string;
}

interface RouteInfo {
  distance: number;
  duration: number;
  geojson: GeoJSON.Feature<GeoJSON.LineString>;
}

const routeLayerStyle = {
  id: 'route',
  type: 'line' as const,
  paint: {
    'line-color': '#3b82f6',
    'line-width': 6,
    'line-opacity': 0.9,
  },
};

const DeliveryMap: React.FC<DeliveryMapProps> = ({ origin, destination, phoneNumber, userLocation }) => {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [isFullscreen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v11");
  const [viewState, setViewState] = useState({
    latitude: origin.x,
    longitude: origin.y,
    zoom: 13,
  });

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const openNavigation = () => {
    const url = `https://www.google.com/maps/dir/${origin.x},${origin.y}/${destination.x},${destination.y}`;
    window.open(url, '_blank');
  };

  const fitMapToBounds = useCallback(() => {
    if (!origin || !destination) return;

    const minLat = Math.min(origin.x, destination.x);
    const maxLat = Math.max(origin.x, destination.x);
    const minLng = Math.min(origin.y, destination.y);
    const maxLng = Math.max(origin.y, destination.y);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 13;
    if (maxDiff > 0.1) zoom = 10;
    else if (maxDiff > 0.05) zoom = 11;
    else if (maxDiff > 0.01) zoom = 12;

    setViewState({
      latitude: centerLat,
      longitude: centerLng,
      zoom: zoom,
    });
  }, [origin, destination]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const from = `${origin.y},${origin.x}`;
        const to = `${destination.y},${destination.x}`;

        const MAPBOX_TOKEN = "pk.eyJ1IjoiLS11bHJpa2siLCJhIjoiY203YzV5dHIyMGY3NjJqc2Q5MmpxNm4ycCJ9.TilyKOmKcw2ekL2PY8Xofw";
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from};${to}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch route');

        const data = await response.json();
        const route = data.routes[0];

        setRouteInfo({
          distance: route.distance,
          duration: route.duration,
          geojson: route.geometry,
        });
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    };

    if (origin && destination) {
      fetchRoute();
      fitMapToBounds();
    }
  }, [origin, destination, fitMapToBounds]);


  useEffect(() => {
    const orderDetailsStr = localStorage.getItem("orderLocations");
    let orderId: number | null = null;
    if (orderDetailsStr) {
      try {
        const orderDetails = JSON.parse(orderDetailsStr);
        orderId = Number(orderDetails.orderId);
      } catch (e) {
        console.error("Failed to parse orderLocations from localStorage", e);
      }
    }
    if (orderId !== null && !isNaN(orderId)) {
      setTimeout(() => {
        checkOrderStatus(orderId as number);
      }, 20000);
    }
  }, []);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'} bg-gray-900`}>
      {/* Header with controls */}


      {/* Map */}
      <Map
        mapboxAccessToken="pk.eyJ1IjoiLS11bHJpa2siLCJhIjoiY203YzV5dHIyMGY3NjJqc2Q5MmpxNm4ycCJ9.TilyKOmKcw2ekL2PY8Xofw"
        initialViewState={viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        attributionControl={false}
      >

        <div className="absolute grid left-4 top-12 flex items-center space-x-2">
          <button
            onClick={async () => {
              try {
                // Replace with actual delivery person id
                const deliveryPersonId = localStorage.getItem("deliveryPersonId");
                const res = await fetch(`https://sosika-backend.onrender.com/api/deliveryPerson/${deliveryPersonId}/toggle-active`, {
                  method: "PUT",
                });
                const data = await res.json();
                setIsActive(data.is_active);
              } catch (err) {
                console.error("Failed to toggle active status", err);
              }
            }}
            className={`p-2 rounded-lg transition-colors mt-2 font-semibold ${isActive ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
          >
            {isActive ? "Active" : "Inactive"}
          </button>
          <button
            onClick={() => setIsInfoVisible(!isInfoVisible)}
            className="p-2 bg-gray-500 rounded-lg hover:bg-gray-200 w-10 my-2 transition-colors"
          >
            {isInfoVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          

        </div>

        {/* Navigation Controls */}
        <NavigationControl position="top-right" style={{ top: '80px' }} />

        {/* Geolocation Control */}
        <GeolocateControl
          position="top-right"
          style={{ top: '180px' }}
          trackUserLocation={true}
          showUserHeading={true}
        />

        {/* Origin Marker (Pickup) */}
        <Marker latitude={origin.x} longitude={origin.y}>
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
              Pickup
            </div>
          </div>
        </Marker>

        {/* Destination Marker (Delivery) */}
        <Marker latitude={destination.x} longitude={destination.y}>
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <MapPin size={16} color="white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
              Delivery
            </div>
          </div>
        </Marker>

        {/* User Location Marker */}
        {userLocation && (
          <Marker latitude={userLocation.x} longitude={userLocation.y}>
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse">
              <div className="w-full h-full bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </Marker>
        )}

        {/* Route Line */}
        {routeInfo && (
          <Source id="route" type="geojson" data={routeInfo.geojson}>
            <Layer {...routeLayerStyle} />
          </Source>
        )}
      </Map>

      {/* Route Information Drawer using shadcn */}
      {isInfoVisible && routeInfo && (
        <Drawer open={isInfoVisible} onOpenChange={setIsInfoVisible}>
          <DrawerTrigger className='bg-black' asChild>
            {/* Hidden trigger, panel is controlled by isInfoVisible */}
            <div />
          </DrawerTrigger>
          <DrawerContent className='bg-white'>
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <DrawerTitle className='text-center'>Route Information</DrawerTitle>
              </DrawerHeader>
              <div className="grid grid-cols-2 gap-4 mb-6 px-4">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <Route className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {formatDistance(routeInfo.distance)}
                  </div>
                  <div className="text-sm text-gray-600">Distance</div>
                </div>
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {formatDuration(routeInfo.duration)}
                  </div>
                  <div className="text-sm text-gray-600">ETA</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 px-4">
                <Button
                  onClick={openNavigation}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <img src="/google-maps.png" alt="Google Maps" className="w-6 h-6 mr-2" />
                  <span>Navigate</span>
                </Button>
                <Button
                  onClick={handleCall}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  <Phone size={20} />
                  <span>Call Customer</span>
                </Button>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" className="w-full mt-2">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
      <div className="absolute top-2 left-4 z-10">
        <select
          value={mapStyle}
          onChange={(e) => setMapStyle(e.target.value)}
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
          <option value="mapbox://styles/mapbox/satellite-streets-v11">Satellite</option>
          <option value="mapbox://styles/mapbox/navigation-day-v1">Navigation</option>
          <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default DeliveryMap;