import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function RouteMap({ points = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView(points[0], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    points.forEach((p) => {
      L.marker(p).addTo(mapInstance.current);
    });

    L.polyline(points, {
      color: "blue",
      weight: 4,
      opacity: 0.8,
    }).addTo(mapInstance.current);

    mapInstance.current.fitBounds(points);

    return () => {
      mapInstance.current.remove();
      mapInstance.current = null;
    };
  }, [points]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-xl shadow-md"
    ></div>
  );
}
