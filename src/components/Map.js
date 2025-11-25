import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Loader2 } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function RouteMap({ points = [] }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView(points[0], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    points.forEach((p) => {
      L.marker(p).addTo(mapInstance.current);
    });

    if (points.length > 1) {
      setLoading(true);
      const waypoints = points.map(p => `${p[1]},${p[0]}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full&geometries=geojson`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

            L.polyline(coordinates, {
              color: "blue",
              weight: 4,
              opacity: 0.8,
            }).addTo(mapInstance.current);

            mapInstance.current.fitBounds(coordinates);
          }
        })
        .catch(err => {
          console.error("Error fetching route:", err);
          L.polyline(points, {
            color: "blue",
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10'
          }).addTo(mapInstance.current);
          mapInstance.current.fitBounds(points);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (points.length === 1) {
      mapInstance.current.setView(points[0], 10);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [points]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapRef}
        className="w-full h-full rounded-xl shadow-md"
      ></div>
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[1000] flex items-center justify-center rounded-xl">
          <div className="animate-spin text-white">
            <Loader2 size={48} />
          </div>
        </div>
      )}
    </div>
  );
}
