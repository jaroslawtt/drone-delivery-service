import { RefObject, useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import { createRoot, Root } from "react-dom/client";
import { Icon } from "~/libs/components/components";
import { MapGetAllItemReponseDto } from "~/packages/map/map";
import { iconNameToSvgIcon } from "~/libs/components/icon/common";

type MarkerRef = {
  marker: maptilersdk.Marker;
  root: Root;
  animationId?: number | null;
};

type Arguments = {
  mapRef: RefObject<maptilersdk.Map | null>;
  drones: MapGetAllItemReponseDto[];
};

const ANIMATION_DURATION_MS = 1400;

const animateMarkerPosition = (
  marker: maptilersdk.Marker,
  fromLngLat: [number, number],
  toLngLat: [number, number],
  duration: number,
  onAnimationComplete: () => void,
): number => {
  const startTime = performance.now();

  const animationStep = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentLng = fromLngLat[0] + (toLngLat[0] - fromLngLat[0]) * progress;
    const currentLat = fromLngLat[1] + (toLngLat[1] - fromLngLat[1]) * progress;

    marker.setLngLat([currentLng, currentLat]);

    if (progress < 1) {
      requestAnimationFrame(animationStep);
    } else {
      onAnimationComplete();
    }
  };
  return requestAnimationFrame(animationStep);
};

const useSetDronesMarkers = ({ mapRef, drones: dronesData }: Arguments) => {
  const markersRef = useRef<Map<number, MarkerRef>>(new Map());

  useEffect(() => {
    if (!mapRef.current) return;

    const currentMap = mapRef.current;
    const currentMarkersMap = markersRef.current;

    const droneIds = new Set(dronesData.map((drone) => drone.id));

    dronesData.forEach((drone) => {
      const existingMarkerRef = currentMarkersMap.get(drone.id);
      const targetLngLat: [number, number] = [
        +drone.location.longitude,
        +drone.location.latitude,
      ];
      const iconName: keyof typeof iconNameToSvgIcon = drone.isDelivering
        ? "drone-with-box"
        : "drone";

      if (existingMarkerRef) {
        if (existingMarkerRef.animationId) {
          cancelAnimationFrame(existingMarkerRef.animationId);
          existingMarkerRef.animationId = null;
        }

        const currentMarkerPosition = existingMarkerRef.marker.getLngLat();
        const fromLngLat: [number, number] = [
          currentMarkerPosition.lng,
          currentMarkerPosition.lat,
        ];

        existingMarkerRef.root.render(
          <Icon iconName={iconName} className="w-8 h-8" />,
        );

        if (
          fromLngLat.at(0) !== targetLngLat.at(0) ||
          fromLngLat.at(1) !== targetLngLat.at(1)
        ) {
          existingMarkerRef.animationId = animateMarkerPosition(
            existingMarkerRef.marker,
            fromLngLat,
            targetLngLat,
            ANIMATION_DURATION_MS,
            () => {
              const ref = currentMarkersMap.get(drone.id);
              if (ref) {
                ref.animationId = null;
              }
            },
          );
        }
      } else {
        const markerElement = document.createElement("div");
        const root = createRoot(markerElement);
        root.render(<Icon iconName={iconName} className="w-8 h-8" />);

        const marker = new maptilersdk.Marker({
          anchor: "bottom",
          element: markerElement,
        })
          .setLngLat(targetLngLat)
          .addTo(currentMap);

        currentMarkersMap.set(drone.id, {
          marker,
          root,
          animationId: null,
        });
      }
    });

    currentMarkersMap.forEach((markerRef, markerId) => {
      if (!droneIds.has(markerId)) {
        if (markerRef.animationId) {
          cancelAnimationFrame(markerRef.animationId);
        }

        markerRef.marker.remove();
        markerRef.root.unmount();
        currentMarkersMap.delete(markerId);
      }
    });
  }, [mapRef, dronesData]);
};

export { useSetDronesMarkers };
