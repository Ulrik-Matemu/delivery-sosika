import { useEffect, useState } from "react";
import DeliveryMap from "@/components/shared/Map";
import { getUserLocation, type Coordinates } from "@/services/location-tracking"; // update path as needed

export const Home = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    getUserLocation()
      .then((location) => {
        setUserLocation(location);
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  }, []);

  const orderLocationsStr = localStorage.getItem("orderLocations");
  const orderLocations = orderLocationsStr ? JSON.parse(orderLocationsStr) : null;

  

  return (
    <>
      <DeliveryMap
        origin={orderLocations?.pickup_location}
        destination={orderLocations?.dropoff_location}
        phoneNumber={orderLocations?.phoneNumber}
        userLocation={userLocation}
      />
    </>
  );
};
