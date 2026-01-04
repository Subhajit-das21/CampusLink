import { useState, useEffect } from 'react';

const CAMPUS_GATE = { lat: 22.5580536, lng: 88.3966811 };

/**
 * useDistanceMatrix Hook: Spatial Calculation Engine
 * Triangulates the distance between the user (or gate) and a network node.
 */
export const useDistanceMatrix = (isLoaded: boolean, serviceCoords: { lat: number, lng: number } | null) => {
  const [data, setData] = useState({
    distance: '',
    duration: '',
    isFromGate: false
  });

  useEffect(() => {
    // 1. Load Guard: Prevent execution if API or data is missing
    if (!isLoaded || !serviceCoords || !window.google?.maps?.DistanceMatrixService) return;

    const calculate = (origin: { lat: number, lng: number }, fromGate: boolean) => {
      try {
        const matrixService = new google.maps.DistanceMatrixService();
        
        matrixService.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [serviceCoords],
            travelMode: google.maps.TravelMode.WALKING, // Optimized for student pedestrian traffic
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            // Validate API status and specific element availability
            if (status === 'OK' && response?.rows[0].elements[0].status === 'OK') {
              const result = response.rows[0].elements[0];
              setData({
                distance: result.distance.text,
                duration: result.duration.text,
                isFromGate: fromGate
              });
            }
          }
        );
      } catch (err) {
        console.error("Nexus Distance Matrix Failure:", err);
      }
    };

    /**
     * 2. Debounce/Rate-Limit: 
     * Small staggered delay to prevent "OVER_QUERY_LIMIT" when multiple 
     * ServiceCards initialize simultaneously in the directory.
     */
    const timer = setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            calculate({ lat: pos.coords.latitude, lng: pos.coords.longitude }, false);
          },
          () => {
            // Fallback to Gate if user denies permission or signal is lost
            calculate(CAMPUS_GATE, true);
          },
          { 
            enableHighAccuracy: false, // Set to false for faster response in dense campus buildings
            timeout: 5000 
          }
        );
      } else {
        calculate(CAMPUS_GATE, true);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [isLoaded, serviceCoords?.lat, serviceCoords?.lng]); // Dependency check on specific coord values

  return data;
};