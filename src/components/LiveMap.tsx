import React, { useState, useEffect, useRef } from 'react';
import { useShuttles } from '../ShuttleContext';

// Babcock University Campus Landmarks based on the map image
const LANDMARKS = [
  { name: 'Bethel Splendor Hall', x: 420, y: 100 },
  { name: 'Winslow Hall', x: 360, y: 140 },
  { name: 'White Hall', x: 650, y: 160 },
  { name: 'Nyberg Hall', x: 600, y: 200 },
  { name: 'Crystal Hall', x: 720, y: 260 },
  { name: 'Platinum Hall', x: 620, y: 260 },
  { name: 'Busa House', x: 480, y: 240 },
  { name: 'Babcock Amphitheatre', x: 580, y: 320 },
  { name: 'Babcock University Registry', x: 480, y: 420 },
  { name: 'Biochemistry Research Lab', x: 580, y: 480 },
  { name: 'Babcock Guest House', x: 280, y: 280 },
  { name: 'Blessed Naira', x: 120, y: 120 },
  { name: 'Babcock University Teaching Hospital', x: 140, y: 320 },
  { name: 'Andrews Park', x: 380, y: 480 },
];

interface ShuttleMarker {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  targetIndex: number;
}

const LiveMap: React.FC = () => {
  const { shuttles } = useShuttles();
  const [markers, setMarkers] = useState<ShuttleMarker[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);

  // Load the map image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Using a direct URL to the Babcock University map
    img.src = 'https://lh5.googleusercontent.com/p/AF1QipN7Ea-z-QC0_g9L0H8e5nHGZ2z6vL6_-TcH2x8=w408-h306-k-no';
    img.onload = () => setMapImage(img);
    img.onerror = () => {
      // Fallback: create a canvas if image doesn't load
      console.warn('Map image failed to load');
    };
  }, []);

  // Initialize shuttle markers with random starting positions
  useEffect(() => {
    const newMarkers = shuttles.map(shuttle => ({
      id: shuttle.id,
      x: Math.random() * 700 + 50,
      y: Math.random() * 500 + 50,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      color: shuttle.color,
      targetIndex: Math.floor(Math.random() * LANDMARKS.length),
    }));
    setMarkers(newMarkers);
  }, [shuttles]);

  // Animate shuttle movement with landmark targeting
  useEffect(() => {
    const interval = setInterval(() => {
      setMarkers(prevMarkers =>
        prevMarkers.map(marker => {
          const landmark = LANDMARKS[marker.targetIndex];
          const dx = landmark.x - marker.x;
          const dy = landmark.y - marker.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let newVx = marker.vx;
          let newVy = marker.vy;

          // Move towards landmark
          if (distance > 15) {
            newVx = (dx / distance) * 1.2;
            newVy = (dy / distance) * 1.2;
          } else {
            // Reached landmark, pick a new one
            return {
              ...marker,
              targetIndex: Math.floor(Math.random() * LANDMARKS.length),
              vx: newVx,
              vy: newVy,
            };
          }

          let newX = marker.x + newVx;
          let newY = marker.y + newVy;

          // Bounce off edges
          if (newX < 20) { newVx = Math.abs(newVx); newX = 20; }
          if (newX > 780) { newVx = -Math.abs(newVx); newX = 780; }
          if (newY < 20) { newVy = Math.abs(newVy); newY = 20; }
          if (newY > 520) { newVy = -Math.abs(newVy); newY = 520; }

          return {
            ...marker,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Draw the map and markers on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#E8F5E9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw map image if loaded
    if (mapImage) {
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw landmarks
    LANDMARKS.forEach(landmark => {
      ctx.fillStyle = '#1976D2';
      ctx.beginPath();
      ctx.arc(landmark.x, landmark.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.fillText(landmark.name, landmark.x + 8, landmark.y - 3);
    });

    // Draw shuttle markers
    markers.forEach(marker => {
      const colorMap: Record<string, string> = {
        'White': '#F5F5F5',
        'Blue': '#3B82F6',
        'Green': '#10B981',
        'Yellow': '#FBBF24',
        'Black': '#1F2937',
        'Silver': '#D1D5DB',
        'Red': '#EF4444',
        'Orange': '#F97316',
      };
      const color = colorMap[marker.color] || '#999';

      // Draw shuttle circle
      ctx.fillStyle = color;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(marker.x, marker.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw shuttle label
      ctx.fillStyle = '#333';
      ctx.font = 'bold 9px Arial';
      const label = String(marker.id).padStart(3, '0');
      ctx.fillText(label, marker.x - 12, marker.y + 3);
    });
  }, [mapImage, markers]);

  const getColorHex = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'White': '#F5F5F5',
      'Blue': '#3B82F6',
      'Green': '#10B981',
      'Yellow': '#FBBF24',
      'Black': '#1F2937',
      'Silver': '#D1D5DB',
      'Red': '#EF4444',
      'Orange': '#F97316',
    };
    return colorMap[colorName] || '#999';
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
      {/* Canvas Map */}
      <canvas
        ref={canvasRef}
        width={800}
        height={540}
        className="w-full h-full"
      />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-md text-xs max-h-60 overflow-y-auto">
        <div className="font-semibold mb-2">Active Shuttles:</div>
        <div className="space-y-2">
          {shuttles.map(shuttle => (
            <div key={shuttle.id} className="border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span style={{ background: getColorHex(shuttle.color), width: 12, height: 12, display: 'inline-block', borderRadius: '50%', border: '1px solid #333' }}></span>
                <span>
                  Shuttle {String(shuttle.id).padStart(3, '0')}
                  <span className={`ml-2 px-2 py-0.5 rounded text-white text-xs ${shuttle.status ? 'bg-green-500' : 'bg-red-500'}`}>
                    {shuttle.status ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
              {shuttle.nextRoute && (
                <div className="ml-4 text-xs bg-blue-50 p-1 rounded">
                  <div className="font-semibold text-blue-900">Next Route:</div>
                  <div className="text-blue-800">
                    {shuttle.nextRoute.origin} → {shuttle.nextRoute.destination}
                  </div>
                  <div className="text-blue-700">
                    ~{shuttle.nextRoute.estimated_time_minutes} min ({shuttle.nextRoute.distance_km} km)
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-md text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-semibold">Live Tracking</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
