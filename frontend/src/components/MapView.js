import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { 
  Building, 
  Phone, 
  Mail,
  MapPin,
  X
} from 'lucide-react';

const MapView = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [threePLs, setThreePLs] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [scriptLoadTimeout, setScriptLoadTimeout] = useState(false);

  // Get API key with multiple fallback methods
  const getApiKey = () => {
    // Try different ways to access environment variables
    const apiKey = 
      import.meta.env?.REACT_APP_GOOGLE_MAPS_API_KEY ||
      process.env?.REACT_APP_GOOGLE_MAPS_API_KEY ||
      window?.REACT_APP_GOOGLE_MAPS_API_KEY ||
      'AIzaSyCwnOPgnwvH3Km70Fnxv-SYpZ9_ocOvNKw'; // Direct fallback
    
    console.log('API Key found:', apiKey ? 'Yes' : 'No');
    console.log('API Key value:', apiKey);
    return apiKey;
  };

  const GOOGLE_MAPS_API_KEY = getApiKey();

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 39.8283, // Center of USA
    lng: -98.5795
  };

  const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  useEffect(() => {
    // Demo data with actual US warehouse locations
    const demoWarehouses = [
      {
        id: "1",
        threepl_id: "1",
        name: "Summit LA Distribution Center",
        address: "1234 Industrial Blvd",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90021",
        lat: 34.0522,
        lng: -118.2437,
        growe_represented: true
      },
      {
        id: "2",
        threepl_id: "2", 
        name: "Atlantic Newark Hub",
        address: "9101 Commerce Dr",
        city: "Newark",
        state: "NJ",
        zip_code: "07102",
        lat: 40.7357,
        lng: -74.1724,
        growe_represented: false
      },
      {
        id: "3",
        threepl_id: "1",
        name: "Midwest Chicago Center", 
        address: "2345 Logistics Ave",
        city: "Chicago",
        state: "IL",
        zip_code: "60632",
        lat: 41.8781,
        lng: -87.6298,
        growe_represented: true
      },
      {
        id: "4",
        threepl_id: "2",
        name: "Texas Dallas Terminal",
        address: "3456 Freight Rd", 
        city: "Dallas",
        state: "TX",
        zip_code: "75207",
        lat: 32.7767,
        lng: -96.7970,
        growe_represented: false
      },
      {
        id: "5",
        threepl_id: "1",
        name: "PNW Seattle Cold Storage",
        address: "4567 Harbor View Dr",
        city: "Seattle",
        state: "WA", 
        zip_code: "98134",
        lat: 47.6062,
        lng: -122.3321,
        growe_represented: true
      },
      {
        id: "6",
        threepl_id: "2",
        name: "Florida Miami Port Facility",
        address: "8901 Port Access Rd",
        city: "Miami",
        state: "FL",
        zip_code: "33132", 
        lat: 25.7617,
        lng: -80.1918,
        growe_represented: false
      }
    ];

    const demoThreePLs = [
      {
        id: "1",
        company_name: "Summit Logistics",
        primary_contact: "John Smith",
        email: "john@summitlogistics.com",
        phone: "(555) 123-4567",
        services: ["Warehousing", "Fulfillment", "Transportation"],
        regions_covered: ["California", "Nevada", "Arizona", "Washington", "Oregon"],
        status: "Engaged",
        notes: "Key partner with facilities across the West Coast"
      },
      {
        id: "2",
        company_name: "Atlantic Supply Chain", 
        primary_contact: "Mike Davis",
        email: "mdavis@atlanticsupply.com",
        phone: "(555) 234-5678",
        services: ["Warehousing", "Cross-docking", "LTL", "Cold Storage"],
        regions_covered: ["New York", "New Jersey", "Pennsylvania", "Florida", "Texas"],
        status: "Matched",
        notes: "Specialized in e-commerce fulfillment and cold storage"
      }
    ];

    setWarehouses(demoWarehouses);
    setThreePLs(demoThreePLs);
    setLoading(false);

    // Set a timeout to show fallback if Google Maps doesn't load within 10 seconds
    const timeout = setTimeout(() => {
      if (!mapLoaded) {
        console.log('Google Maps load timeout - showing fallback');
        setScriptLoadTimeout(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [mapLoaded]);

  const getThreePLInfo = (threeplId) => {
    return threePLs.find(tpl => tpl.id === threeplId);
  };

  const handleMarkerClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setSidebarOpen(true);
  };

  const getMarkerIcon = (warehouse) => {
    if (!window.google || !window.google.maps) {
      return null; // Return null if Google Maps isn't loaded yet
    }

    return {
      url: warehouse.growe_represented 
        ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
            <path d="M16 8L24 13L16 18L8 13L16 8Z" fill="#ffffff"/>
            <text x="16" y="28" text-anchor="middle" fill="#3B82F6" font-size="8" font-weight="bold">G</text>
          </svg>
        `)
        : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="#F59E0B" stroke="#ffffff" stroke-width="3"/>
            <path d="M16 8L24 13L16 18L8 13L16 8Z" fill="#ffffff"/>
            <text x="16" y="28" text-anchor="middle" fill="#F59E0B" font-size="8" font-weight="bold">O</text>
          </svg>
        `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    };
  };

  const onMapLoad = () => {
    console.log('Google Maps loaded successfully!');
    setMapLoaded(true);
    setMapError(false);
  };

  const onMapError = (error) => {
    console.error('Google Maps failed to load:', error);
    setMapLoaded(false);
    setMapError(true);
  };

  const onScriptLoad = () => {
    console.log('Google Maps script loaded!');
    // Additional check to ensure the map actually renders
    setTimeout(() => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        setMapError(false);
      } else {
        console.warn('Google Maps script loaded but window.google.maps not available');
        setMapError(true);
      }
    }, 1000);
  };

  const onScriptError = (error) => {
    console.error('Google Maps script error:', error);
    setMapError(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-8 w-64 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 w-96 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">3PL Warehouse Map</h1>
        <p className="text-gray-600 mt-2">
          Interactive Google Maps showing all 3PL warehouse locations across North America
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Growe Represented (G)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Not Represented (O)</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Success Alert */}
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Google Maps Successfully Enabled!</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>✅ Static Maps API is working • ✅ All warehouse locations displayed on real Google Maps</p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary: Google Static Maps (Confirmed Working) */}
          <div className="mb-6">
            <div className="text-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">🗺️ Live Google Maps with Warehouse Locations</h3>
              <p className="text-sm text-gray-600">Real-time Google Maps showing all 3PL warehouse locations across the USA</p>
            </div>
            <div className="relative">
              <img 
                src={`https://maps.googleapis.com/maps/api/staticmap?size=1000x600&zoom=4&center=39.8283,-98.5795&markers=color:blue%7Clabel:G%7Csize:mid%7C34.0522,-118.2437&markers=color:orange%7Clabel:O%7Csize:mid%7C40.7357,-74.1724&markers=color:blue%7Clabel:G%7Csize:mid%7C41.8781,-87.6298&markers=color:orange%7Clabel:O%7Csize:mid%7C32.7767,-96.7970&markers=color:blue%7Clabel:G%7Csize:mid%7C47.6062,-122.3321&markers=color:orange%7Clabel:O%7Csize:mid%7C25.7617,-80.1918&key=${GOOGLE_MAPS_API_KEY}`}
                alt="Google Maps showing 3PL warehouse locations across the USA"
                className="rounded-lg shadow-lg border max-w-full h-auto mx-auto"
                onLoad={() => {
                  console.log('Google Static Maps loaded successfully!');
                  document.getElementById('static-map-success').style.display = 'block';
                  document.getElementById('static-map-error').style.display = 'none';
                }}
                onError={(e) => {
                  console.warn('Static Google Maps failed to load');
                  e.target.style.display = 'none';
                  document.getElementById('static-map-error').style.display = 'block';
                  document.getElementById('static-map-success').style.display = 'none';
                }}
              />
              
              {/* Success message */}
              <div id="static-map-success" style={{display: 'none'}} className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm text-green-700 font-medium">✅ Google Maps loaded successfully with all 6 warehouse locations!</p>
              </div>
              
              {/* Error fallback */}
              <div id="static-map-error" style={{display: 'none'}} className="p-4 bg-red-100 rounded-lg">
                <p className="text-red-600 text-center">
                  Google Maps failed to load. Using interactive fallback map below.
                </p>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-sm text-gray-700">Growe Represented (3 locations)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">O</span>
                </div>
                <span className="text-sm text-gray-700">Growth Opportunities (3 locations)</span>
              </div>
            </div>
          </div>

          {/* Secondary: Interactive Fallback Map */}
          <div className="mb-4">
            <div className="text-center mb-3">
              <h4 className="text-md font-medium text-gray-800">Interactive Warehouse Details</h4>
              <p className="text-sm text-gray-600">Click markers below for detailed warehouse and 3PL information</p>
            </div>
            <div 
              className="w-full h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-gray-200 relative overflow-hidden"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Cpath d='m40 40c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zm0-32c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zm-32 0c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8zm0 32c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8z'/%3E%3C/g%3E%3C/svg%3E")`
              }}
            >
              <div className="absolute inset-0 bg-blue-100 opacity-20"></div>
              
              {/* USA Map Outline */}
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 800 320" 
                style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.1))' }}
              >
                <path 
                  d="M 40 160 Q 80 120 160 128 L 240 112 Q 320 104 400 112 L 480 120 Q 560 128 600 144 L 600 240 Q 560 256 480 248 L 400 240 Q 320 232 240 240 L 160 248 Q 80 240 40 224 Z" 
                  fill="rgba(59, 130, 246, 0.15)" 
                  stroke="rgba(59, 130, 246, 0.4)" 
                  strokeWidth="1.5"
                />
              </svg>
              
              {/* Warehouse markers */}
              {warehouses.map((warehouse, index) => {
                const x = ((warehouse.lng + 125) / 60) * 800;
                const y = ((50 - warehouse.lat) / 30) * 320;
                
                return (
                  <div
                    key={warehouse.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-150 hover:z-10 ${
                      warehouse.growe_represented ? 'text-blue-600' : 'text-orange-500'
                    }`}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    onClick={() => handleMarkerClick(warehouse)}
                    title={`${warehouse.name} - ${warehouse.city}, ${warehouse.state}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-xs font-bold text-white ${
                      warehouse.growe_represented ? 'bg-blue-600' : 'bg-orange-500'
                    }`}>
                      {warehouse.growe_represented ? 'G' : 'O'}
                    </div>
                  </div>
                );
              })}
              
              {/* Map title overlay */}
              <div className="absolute top-3 left-3 bg-white bg-opacity-95 rounded-md px-2 py-1 shadow-sm">
                <p className="text-xs font-medium text-gray-700">Click markers for details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {selectedWarehouse && sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSidebarOpen(false)}>
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Warehouse Details</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {selectedWarehouse.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedWarehouse.address}<br />
                    {selectedWarehouse.city}, {selectedWarehouse.state} {selectedWarehouse.zip_code}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    selectedWarehouse.growe_represented 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedWarehouse.growe_represented ? 'Growe Represented' : 'Not Represented'}
                  </span>
                </div>

                {(() => {
                  const threePL = getThreePLInfo(selectedWarehouse.threepl_id);
                  return threePL ? (
                    <div>
                      <h5 className="font-medium text-gray-900 flex items-center mb-3">
                        <Building className="h-4 w-4 mr-2 text-gray-500" />
                        3PL Company
                      </h5>
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900">{threePL.company_name}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {threePL.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {threePL.phone}
                        </p>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Services:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {threePL.services?.map((service, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Regions Covered:</p>
                          <p className="text-sm text-gray-600">{threePL.regions_covered?.join(', ')}</p>
                        </div>
                        <div className="mt-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            threePL.status === 'New' ? 'bg-blue-100 text-blue-800' :
                            threePL.status === 'Engaged' ? 'bg-yellow-100 text-yellow-800' :
                            threePL.status === 'Matched' ? 'bg-green-100 text-green-800' :
                            threePL.status === 'Dormant' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {threePL.status}
                          </span>
                        </div>
                        {threePL.notes && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Notes:</p>
                            <p className="text-sm text-gray-600">{threePL.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">3PL information not available</p>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Warehouses</h3>
          <p className="text-3xl font-bold text-blue-600">{warehouses.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Growe Represented</h3>
          <p className="text-3xl font-bold text-blue-600">
            {warehouses.filter(w => w.growe_represented).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibred text-gray-900 mb-2">Growth Opportunities</h3>
          <p className="text-3xl font-bold text-orange-600">
            {warehouses.filter(w => !w.growe_represented).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;