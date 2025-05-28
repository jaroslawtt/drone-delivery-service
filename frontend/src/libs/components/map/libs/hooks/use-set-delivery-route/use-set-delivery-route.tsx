import { RefObject, useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { useOrderStore } from "~/stores/orders/orders";
import { useShallow } from "zustand/react/shallow";
import { createRoot, Root } from "react-dom/client";
import { Icon } from "~/libs/components/components";
import { iconNameToSvgIcon } from "~/libs/components/icon/common";
import type {
  FeatureCollection,
  LineString,
  Point as GeoJsonPoint,
  Feature,
  Polygon,
  Position,
} from "geojson";
import distance from "@turf/distance";
import { point as turfPoint } from "@turf/helpers";
import { mapApi } from "~/packages/map/map";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { useQuery } from "@tanstack/react-query";

type Arguments = {
  mapRef: RefObject<maptilersdk.Map | null>;
  isEditable?: boolean;
};

type PointMarkerRefType = {
  marker: maptilersdk.Marker;
  root: Root;
} | null;

const DELIVERY_ROUTE_SOURCE_ID = "delivery-path-source";
const DELIVERY_ROUTE_LAYER_ID = "delivery-path-layer";

const ROUTE_LABEL_SOURCE_ID = "delivery-route-label-source";
const ROUTE_LABEL_LAYER_ID = "delivery-route-label-layer";

const useSetDeliveryRoute = ({ mapRef, isEditable = true }: Arguments) => {
  const { data: kyivCityCoordinates, isLoading: isLoadingKyivCoords } =
    useQuery<Position[][] | undefined>({
      queryKey: ["kyiv-city-area-coords"],
      queryFn: mapApi.getKyivCityArea.bind(mapApi),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    });

  const { destination, entryPoint, setDestination, setEntryPoint } =
    useOrderStore(
      useShallow((state) => ({
        destination: state.destination,
        entryPoint: state.entryPoint,
        setDestination: state.setDestination,
        setEntryPoint: state.setEntryPoint,
      })),
    );

  const destinationMarkerRef = useRef<PointMarkerRefType>(null);
  const entryPointMarkerRef = useRef<PointMarkerRefType>(null);
  const routeLayerInitializedRef = useRef(false);
  const routeLabelInitializedRef = useRef(false);

  const createOrUpdatePointMarker = (
    map: maptilersdk.Map,
    point: { latitude: string; longitude: string } | null,
    markerRef: RefObject<PointMarkerRefType>,
    iconName: keyof typeof iconNameToSvgIcon,
    iconClassName: string = "w-7 h-7 text-blue-600",
  ) => {
    if (markerRef.current) {
      const markerDataToClean = markerRef.current;
      markerRef.current = null;
      requestAnimationFrame(() => {
        markerDataToClean.marker.remove();
        markerDataToClean.root.unmount();
      });
    }

    if (point && map) {
      const lngLat: [number, number] = [+point.longitude, +point.latitude];
      const markerElement = document.createElement("div");
      const root = createRoot(markerElement);

      root.render(<Icon iconName={iconName} className={iconClassName} />);

      const newMarker = new maptilersdk.Marker({
        element: markerElement,
        anchor: "bottom",
      })
        .setLngLat(lngLat)
        .addTo(map);
      map.panTo(lngLat);

      markerRef.current = { marker: newMarker, root };
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      if (destinationMarkerRef.current) {
        const markerDataToClean = destinationMarkerRef.current;
        destinationMarkerRef.current = null;
        requestAnimationFrame(() => {
          markerDataToClean.marker.remove();
          markerDataToClean.root.unmount();
        });
      }
      return;
    }
    const map = mapRef.current;
    createOrUpdatePointMarker(
      map,
      destination,
      destinationMarkerRef,
      "destination-pointer",
      "w-8 h-8 text-red-500",
    );

    return () => {
      if (destinationMarkerRef.current) {
        const markerDataToClean = destinationMarkerRef.current;
        destinationMarkerRef.current = null;
        requestAnimationFrame(() => {
          markerDataToClean.marker.remove();
          markerDataToClean.root.unmount();
        });
      }
    };
  }, [destination, mapRef]);

  useEffect(() => {
    if (!mapRef.current) {
      if (entryPointMarkerRef.current) {
        const markerDataToClean = entryPointMarkerRef.current;
        entryPointMarkerRef.current = null;
        requestAnimationFrame(() => {
          markerDataToClean.marker.remove();
          markerDataToClean.root.unmount();
        });
      }
      return;
    }
    const map = mapRef.current;

    createOrUpdatePointMarker(
      map,
      entryPoint,
      entryPointMarkerRef,
      "pickup-pointer",
      "w-8 h-8 text-green-500",
    );

    return () => {
      if (entryPointMarkerRef.current) {
        const markerDataToClean = entryPointMarkerRef.current;
        entryPointMarkerRef.current = null;
        requestAnimationFrame(() => {
          markerDataToClean.marker.remove();
          markerDataToClean.root.unmount();
        });
      }
    };
  }, [entryPoint, mapRef]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    if (!map.isStyleLoaded()) {
      return;
    }

    const removeRouteAndLabel = () => {
      if (routeLayerInitializedRef.current) {
        if (map.getLayer(DELIVERY_ROUTE_LAYER_ID)) {
          map.removeLayer(DELIVERY_ROUTE_LAYER_ID);
        }
        if (map.getSource(DELIVERY_ROUTE_SOURCE_ID)) {
          map.removeSource(DELIVERY_ROUTE_SOURCE_ID);
        }
        routeLayerInitializedRef.current = false;
      }
      if (routeLabelInitializedRef.current) {
        if (map.getLayer(ROUTE_LABEL_LAYER_ID)) {
          map.removeLayer(ROUTE_LABEL_LAYER_ID);
        }
        if (map.getSource(ROUTE_LABEL_SOURCE_ID)) {
          map.removeSource(ROUTE_LABEL_SOURCE_ID);
        }
        routeLabelInitializedRef.current = false;
      }
    };

    if (entryPoint && destination) {
      const startCoords: [number, number] = [
        +entryPoint.longitude,
        +entryPoint.latitude,
      ];
      const endCoords: [number, number] = [
        +destination.longitude,
        +destination.latitude,
      ];

      if (startCoords[0] === endCoords[0] && startCoords[1] === endCoords[1]) {
        removeRouteAndLabel();
        return;
      }

      const routeGeoJson: FeatureCollection<LineString> = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [startCoords, endCoords], // Straight line
            },
          },
        ],
      };

      const from = turfPoint([startCoords[0], startCoords[1]]);
      const to = turfPoint([endCoords[0], endCoords[1]]);
      const totalDistance = distance(from, to, { units: "kilometers" }).toFixed(
        2,
      );
      const distanceText = `${totalDistance} km`;

      const routeSource = map.getSource(
        DELIVERY_ROUTE_SOURCE_ID,
      ) as maptilersdk.GeoJSONSource;
      if (routeSource) {
        routeSource.setData(routeGeoJson);
      } else {
        map.addSource(DELIVERY_ROUTE_SOURCE_ID, {
          type: "geojson",
          data: routeGeoJson,
        });
      }

      if (!map.getLayer(DELIVERY_ROUTE_LAYER_ID)) {
        map.addLayer({
          id: DELIVERY_ROUTE_LAYER_ID,
          type: "line",
          source: DELIVERY_ROUTE_SOURCE_ID,
          paint: {
            "line-color": "#000000", // Black color for the route line
            "line-width": 2.5,
            "line-dasharray": [3, 3], // Dashed line
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
        });
      }
      routeLayerInitializedRef.current = true;

      // Calculate midpoint for the label
      const midPointLng = (startCoords[0] + endCoords[0]) / 2;
      const midPointLat = (startCoords[1] + endCoords[1]) / 2;

      const labelGeoJson: Feature<GeoJsonPoint> = {
        type: "Feature",
        properties: {
          description: distanceText,
        },
        geometry: {
          type: "Point",
          coordinates: [midPointLng, midPointLat],
        },
      };

      // Update or add label source and layer
      const labelSource = map.getSource(
        ROUTE_LABEL_SOURCE_ID,
      ) as maptilersdk.GeoJSONSource;
      if (labelSource) {
        labelSource.setData(labelGeoJson);
      } else {
        map.addSource(ROUTE_LABEL_SOURCE_ID, {
          type: "geojson",
          data: labelGeoJson,
        });
      }

      if (!map.getLayer(ROUTE_LABEL_LAYER_ID)) {
        map.addLayer({
          id: ROUTE_LABEL_LAYER_ID,
          type: "symbol",
          source: ROUTE_LABEL_SOURCE_ID,
          layout: {
            "text-field": ["get", "description"],
            "text-font": ["Open Sans Regular"], // Ensure this font is available or use a default
            "text-size": 12,
            "text-anchor": "center",
            "text-allow-overlap": true, // Allow overlap to ensure visibility
            "text-offset": [0, -1.5], // Offset slightly above the line
          },
          paint: {
            "text-color": "#000000", // Black color for text
            "text-halo-color": "#FFFFFF", // White halo for better readability
            "text-halo-width": 1,
          },
        });
      }
      routeLabelInitializedRef.current = true;
    } else {
      removeRouteAndLabel();
    }
  }, [entryPoint, destination, mapRef, isEditable]);

  useEffect(() => {
    const mapInstance = mapRef.current;
    const wasRouteInitialized = routeLayerInitializedRef.current;
    const wasLabelInitialized = routeLabelInitializedRef.current;

    return () => {
      if (mapInstance) {
        try {
          if (wasRouteInitialized) {
            if (mapInstance.getLayer(DELIVERY_ROUTE_LAYER_ID)) {
              mapInstance.removeLayer(DELIVERY_ROUTE_LAYER_ID);
            }
            if (mapInstance.getSource(DELIVERY_ROUTE_SOURCE_ID)) {
              mapInstance.removeSource(DELIVERY_ROUTE_SOURCE_ID);
            }
          }
          if (wasLabelInitialized) {
            if (mapInstance.getLayer(ROUTE_LABEL_LAYER_ID)) {
              mapInstance.removeLayer(ROUTE_LABEL_LAYER_ID);
            }
            if (mapInstance.getSource(ROUTE_LABEL_SOURCE_ID)) {
              mapInstance.removeSource(ROUTE_LABEL_SOURCE_ID);
            }
          }
        } catch {
          // console.warn("Error cleaning up delivery route/label layers/sources on unmount:", e);
        }
      }
    };
  }, [mapRef]);

  useEffect(() => {
    if (!mapRef.current || !isEditable) return;
    const map = mapRef.current;

    const handleClick = (event: maptilersdk.MapMouseEvent) => {
      if (!isEditable) {
        return;
      }

      if (
        isLoadingKyivCoords ||
        !kyivCityCoordinates ||
        kyivCityCoordinates.length === 0
      ) {
        console.log("Kyiv boundary data not ready yet, ignoring click.");
        return;
      }

      const kyivBoundaryFeature: Feature<Polygon> = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: kyivCityCoordinates,
        },
      };

      const clickedPoint = turfPoint([event.lngLat.lng, event.lngLat.lat]);
      const isInsideKyiv = booleanPointInPolygon(
        clickedPoint,
        kyivBoundaryFeature,
      );

      if (!isInsideKyiv) {
        return;
      }

      if (!entryPoint) {
        setEntryPoint({
          latitude: event.lngLat.lat.toString(),
          longitude: event.lngLat.lng.toString(),
        });
      } else if (!destination) {
        setDestination({
          latitude: event.lngLat.lat.toString(),
          longitude: event.lngLat.lng.toString(),
        });
      } else {
        setEntryPoint(null);
        setDestination(null);
      }
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [
    destination,
    entryPoint,
    mapRef,
    setDestination,
    setEntryPoint,
    isEditable,
    kyivCityCoordinates,
    isLoadingKyivCoords,
  ]);
};

export { useSetDeliveryRoute };
