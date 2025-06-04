import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { DEFAULT_ZOOM_LEVEL, KYIV_COORDINATES } from "../../constants";
import { useQuery } from "@tanstack/react-query";
import type { Feature, Polygon, Position } from "geojson"; // Import necessary types
import { mapApi } from "~/packages/map/map";

type Arguments = {
  initCoordinates?: [number, number];
  zoomLevel?: number;
};

type ReturnType = {
  mapContainerRef: RefObject<HTMLDivElement | null>;
  mapRef: RefObject<maptilersdk.Map | null>;
};

const KYIV_BOUNDARY_SOURCE_ID = "kyiv-boundary-source";
const KYIV_BOUNDARY_LAYER_ID = "kyiv-boundary-layer";

const useInitMap = ({
  zoomLevel = DEFAULT_ZOOM_LEVEL,
  initCoordinates = KYIV_COORDINATES,
}: Arguments): ReturnType => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const kyivBoundaryLayerInitializedRef = useRef(false); // Ref to track layer init
  const [isMapLoaded, setIsMapLoaded] = useState(false); // State to track if map 'load' event fired

  // --- Fetch Kyiv City Coordinates ---
  const { data: kyivCityCoordinates, isLoading: isLoadingKyivCoords } =
    useQuery<Position[][] | undefined>({
      queryKey: ["kyiv-city-area-coords"], // Use a descriptive key
      queryFn: mapApi.getKyivCityArea.bind(mapApi),
      staleTime: Infinity, // Optional: Cache indefinitely as boundaries likely don't change often
      refetchOnWindowFocus: false, // Optional: Don't refetch just on window focus
    });

  // --- Initialize Map ---
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return; // Exit if map exists or container not ready

    const map = new maptilersdk.Map({
      container: mapContainerRef.current, // No need for 'as' if ref type is correct
      style: maptilersdk.MapStyle.STREETS,
      apiKey: process.env["NEXT_PUBLIC_MAP_API_KEY"] as string,
      center: initCoordinates,
      zoom: zoomLevel,
    });
    mapRef.current = map;

    map.on("load", () => {
      setIsMapLoaded(true);
    });

    // --- Cleanup function for map instance ---
    return () => {
      map.remove(); // Clean up map instance on component unmount
      mapRef.current = null;
      setIsMapLoaded(false); // Reset on cleanup
    };
  }, [initCoordinates, zoomLevel]); // Dependencies for map creation

  // --- Helper function to add the boundary layer ---
  const addKyivBoundaryLayer = useCallback(
    (map: maptilersdk.Map, coordinates: Position[][]) => {
      if (!map.isStyleLoaded()) {
        console.warn(
          "Attempted to add Kyiv boundary layer before style loaded.",
        );
        map.once("styledata", () => {
          // Fallback if somehow called before style is ready despite 'load'
          if (
            kyivCityCoordinates &&
            mapRef.current &&
            mapRef.current.isStyleLoaded()
          ) {
            // Re-check everything
            addKyivBoundaryLayer(mapRef.current, kyivCityCoordinates);
          }
        });
        return;
      }

      const kyivGeoJson: Feature<Polygon> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: coordinates,
        },
      };

      if (map.getLayer(KYIV_BOUNDARY_LAYER_ID)) {
        map.removeLayer(KYIV_BOUNDARY_LAYER_ID);
      }
      if (map.getSource(KYIV_BOUNDARY_SOURCE_ID)) {
        map.removeSource(KYIV_BOUNDARY_SOURCE_ID);
      }

      map.addSource(KYIV_BOUNDARY_SOURCE_ID, {
        type: "geojson",
        data: kyivGeoJson,
      });

      map.addLayer({
        id: KYIV_BOUNDARY_LAYER_ID,
        type: "line", // Use 'line' for an outline
        source: KYIV_BOUNDARY_SOURCE_ID,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FF0000", // Red color
          "line-width": 2.5, // Line thickness
          "line-opacity": 0.8, // Slight transparency
        },
      });
      kyivBoundaryLayerInitializedRef.current = true; // Mark as initialized
    },
    [kyivCityCoordinates],
  );

  // --- Effect to Add Kyiv Boundary Layer ---
  useEffect(() => {
    const map = mapRef.current;

    // If map is not loaded, or no map instance, or data is loading/missing,
    // then ensure any existing boundary layer is cleaned up and exit.
    if (!isMapLoaded || !map || isLoadingKyivCoords || !kyivCityCoordinates) {
      if (map && kyivBoundaryLayerInitializedRef.current) {
        if (map.getLayer(KYIV_BOUNDARY_LAYER_ID)) {
          map.removeLayer(KYIV_BOUNDARY_LAYER_ID);
        }
        if (map.getSource(KYIV_BOUNDARY_SOURCE_ID)) {
          map.removeSource(KYIV_BOUNDARY_SOURCE_ID);
        }
        kyivBoundaryLayerInitializedRef.current = false;
      }
      return;
    }

    // At this point, isMapLoaded is true, map instance exists,
    // and kyivCityCoordinates are loaded and available.
    addKyivBoundaryLayer(map, kyivCityCoordinates);
  }, [
    isMapLoaded,
    kyivCityCoordinates,
    isLoadingKyivCoords,
    addKyivBoundaryLayer,
  ]); // mapRef.current is accessed inside,
  // isMapLoaded ensures map is ready.

  return {
    mapContainerRef,
    mapRef: mapRef,
  };
};

export { useInitMap };
