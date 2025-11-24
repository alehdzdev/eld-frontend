import { useState } from 'react';
import { MapPin, Clock, FileText, Navigation, AlertCircle } from 'lucide-react';

//Assets
import Logo  from './assets/spotter_logo.png';

// Components
import RouteMap from './components/Map';
import ELDLogGraph from './components/EldGraph';
import InputField from './components/Input';

const API_BASE_URL = 'http://localhost:8000';


const App = () => {
  const [start, setStart] = useState("Los Angeles");
  const [pickup, setPickup] = useState("Denver");
  const [dropoff, setDropoff] = useState("Chicago");
  const [cycleUsed, setCycleUsed] = useState(10);
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("map");

  const generateTripPlan = async () => {
    setLoading(true);
    setError("");
    setRouteData(null);
    setLogs([]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/core/generate-plan/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start,
          pickup,
          dropoff,
          cycleUsed
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate plan");
      }

      setRouteData(data.routeData);
      setLogs(data.logs);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      <div className="w-1/3 min-w-[350px] bg-gray-900 border-r border-gray-800 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-6">
            <img src={Logo} alt="Spotter Logo" className="w-10 h-10" />
            <h1 className="text-xl font-bold tracking-tight text-white">SPOTTER TEST <span className="text-blue-500">ELD</span></h1>
          </div>
          
          <div className="space-y-1">
             <InputField label="Current Location" value={start} onChange={(e) => setStart(e.target.value)} placeholder="e.g. Los Angeles" />
             <InputField label="Pickup Location" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="e.g. Denver" />
             <InputField label="Dropoff Location" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="e.g. Chicago" />
             <InputField label="Cycle Used (Hrs)" type="number" value={cycleUsed} onChange={(e) => setCycleUsed(e.target.value)} />
          </div>

          <button 
            onClick={generateTripPlan}
            disabled={loading}
            className={`mt-6 w-full py-3 px-4 rounded-md font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20'}`}
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Navigation size={18} /> Generate Plan</>}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-1 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {routeData && (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs uppercase mb-1">Total Distance</div>
                <div className="text-2xl font-bold text-white">{routeData.totalMiles} <span className="text-sm font-normal text-gray-500">mi</span></div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs uppercase mb-1">Trip Duration</div>
                <div className="text-2xl font-bold text-white">{logs.length} <span className="text-sm font-normal text-gray-500">days</span></div>
              </div>
            </div>

            <h3 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
              <FileText size={18} /> Generated Logs
            </h3>
            <div className="space-y-2">
              {logs.map((log, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveTab('logs')}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-750 rounded border border-gray-700 flex justify-between items-center group transition-colors"
                >
                  <span className="text-sm font-medium text-gray-300">Day {idx+1} Log</span>
                  <span className="text-xs text-blue-400 group-hover:translate-x-1 transition-transform">View &rarr;</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-1 z-[1000] flex gap-1 border border-gray-200">
           <button 
             onClick={() => setActiveTab('map')} 
             className={`px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'map' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             <MapPin size={16} /> Map Route
           </button>
           <button 
             onClick={() => setActiveTab('logs')} 
             className={`px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             <Clock size={16} /> Digital Logs
           </button>
        </div>

        {activeTab === 'map' ? (
          <div className="w-full h-full z-0">
            {!routeData ? (
              <div className="h-full flex items-center justify-center flex-col text-gray-400">
                <div className="w-16 h-16 border-4 border-gray-300 rounded-full flex items-center justify-center mb-4 bg-gray-200">
                  <MapPin className="text-gray-400" size={32}/>
                </div>
                <p>Enter details to generate route</p>
              </div>
            ) : (
              <RouteMap points={routeData.locations} />
            )}
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto p-10 pt-20 bg-gray-100">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Driver Logs</h2>
              {logs.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
                   <p className="text-gray-500">No logs generated yet. Plan a trip first.</p>
                </div>
              ) : (
                logs.map((log, idx) => (
                  <ELDLogGraph key={idx} dayLog={log} dayIndex={idx} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;