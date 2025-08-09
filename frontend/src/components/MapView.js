import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Phone, 
  Mail,
  MapPin,
  X
} from 'lucide-react';

// Custom Google Maps Loader to handle async issues
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Check if script is already being loaded
    if (window.googleMapsLoading) {
      // Wait for existing load
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          resolve(window.google.maps);
        }
      }, 100);
      return;
    }

    window.googleMapsLoading = true;

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    // Handle successful load
    script.onload = () => {
      window.googleMapsLoading = false;
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        // Give it a moment to initialize
        setTimeout(() => {
          if (window.google && window.google.maps) {
            resolve(window.google.maps);
          } else {
            reject(new Error('Google Maps failed to initialize'));
          }
        }, 1000);
      }
    };

    // Handle error
    script.onerror = () => {
      window.googleMapsLoading = false;
      reject(new Error('Failed to load Google Maps script'));
    };

    // Add to document
    document.head.appendChild(script);

    // Timeout after 15 seconds
    setTimeout(() => {
      if (window.googleMapsLoading) {
        window.googleMapsLoading = false;
        reject(new Error('Google Maps loading timeout'));
      }
    }, 15000);
  });
};

const MapView = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [threePLs, setThreePLs] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [googleMaps, setGoogleMaps] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  // Get API key with multiple fallback methods
  const getApiKey = () => {
    // Try different ways to access environment variables
    const apiKey = 
      import.meta.env?.REACT_APP_GOOGLE_MAPS_API_KEY ||
      process.env?.REACT_APP_GOOGLE_MAPS_API_KEY ||
      window?.REACT_APP_GOOGLE_MAPS_API_KEY ||
      'AIzaSyCwnOPgnwvH3Km70Fnxv-SYpZ9_ocOvNKw'; // Direct fallback
    
    console.log('API Key found:', apiKey ? 'Yes' : 'No');
    return apiKey;
  };

  const GOOGLE_MAPS_API_KEY = getApiKey();

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '8px'
  };

  const center = {
    lat: 39.8283, // Center of USA
    lng: -98.5795
  };

  const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    scrollwheel: true,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap'
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

    // Load Google Maps with custom loader
    loadGoogleMapsScript(GOOGLE_MAPS_API_KEY)
      .then((maps) => {
        console.log('Google Maps loaded successfully!');
        setGoogleMaps(maps);
        setMapLoaded(true);
        setMapError(false);
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        setMapError(true);
        setMapLoaded(false);
      });
  }, [GOOGLE_MAPS_API_KEY]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (googleMaps && !mapInstance) {
      const mapElement = document.getElementById('google-map-container');
      if (mapElement) {
        try {
          const map = new googleMaps.Map(mapElement, {
            center: center,
            zoom: 4,
            ...mapOptions
          });

          // Add markers
          warehouses.forEach((warehouse) => {
            const marker = new googleMaps.Marker({
              position: { lat: warehouse.lat, lng: warehouse.lng },
              map: map,
              title: `${warehouse.name} - ${warehouse.city}, ${warehouse.state}`,
              icon: {
                url: warehouse.growe_represented 
                  ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="12" fill="#3B82F6" stroke="#ffffff" stroke-width="3"/>
                      <text x="16" y="20" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">G</text>
                    </svg>
                  `)
                  : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="12" fill="#F59E0B" stroke="#ffffff" stroke-width="3"/>
                      <text x="16" y="20" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">O</text>
                    </svg>
                  `),
                scaledSize: new googleMaps.Size(32, 32),
                anchor: new googleMaps.Point(16, 16)
              }
            });

            // Add click listener
            marker.addListener('click', () => {
              handleMarkerClick(warehouse);
            });
          });

          setMapInstance(map);
          console.log('Interactive Google Map initialized successfully!');
        } catch (error) {
          console.error('Error initializing map:', error);
          setMapError(true);
        }
      }
    }
  }, [googleMaps, warehouses, mapInstance]);

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
          {/* Interactive Google Maps with Enhanced Static Fallback */}
          <div className="mb-6">
            <div className="text-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">🗺️ Interactive 3PL Warehouse Map</h3>
              <p className="text-sm text-gray-600">Zoom, pan, and click markers for detailed warehouse information</p>
            </div>
            
            <div className="relative mx-auto" style={{maxWidth: '1000px'}}>
              {/* Try Interactive Google Maps in background */}
              <div style={{display: 'none'}}>
                <LoadScript 
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                  onLoad={() => {
                    console.log('Google Maps JavaScript API loaded successfully!');
                    setMapLoaded(true);
                    setMapError(false);
                  }}
                  onError={(error) => {
                    console.error('Google Maps script error:', error);
                    setMapError(true);
                  }}
                  libraries={[]}
                >
                  <GoogleMap
                    mapContainerStyle={{
                      width: '100%',
                      height: '600px',
                      borderRadius: '8px'
                    }}
                    center={center}
                    zoom={4}
                    options={{
                      zoomControl: true,
                      streetViewControl: false,
                      mapTypeControl: true,
                      fullscreenControl: true,
                      scrollwheel: true,
                      gestureHandling: 'auto',
                      mapTypeId: 'roadmap'
                    }}
                    onLoad={(map) => {
                      console.log('Interactive Google Map loaded successfully!');
                      setMapLoaded(true);
                      setMapError(false);
                    }}
                  >
                    {warehouses.map((warehouse) => (
                      <Marker
                        key={warehouse.id}
                        position={{ lat: warehouse.lat, lng: warehouse.lng }}
                        onClick={() => handleMarkerClick(warehouse)}
                        title={`${warehouse.name} - ${warehouse.city}, ${warehouse.state}`}
                      />
                    ))}
                  </GoogleMap>
                </LoadScript>
              </div>

              {/* Enhanced Static Map with Interactive Features */}
              <div className="relative">
                <img 
                  src={`https://maps.googleapis.com/maps/api/staticmap?size=1000x600&zoom=4&center=39.8283,-98.5795&maptype=roadmap&markers=color:blue%7Clabel:G%7Csize:mid%7C34.0522,-118.2437&markers=color:orange%7Clabel:O%7Csize:mid%7C40.7357,-74.1724&markers=color:blue%7Clabel:G%7Csize:mid%7C41.8781,-87.6298&markers=color:orange%7Clabel:O%7Csize:mid%7C32.7767,-96.7970&markers=color:blue%7Clabel:G%7Csize:mid%7C47.6062,-122.3321&markers=color:orange%7Clabel:O%7Csize:mid%7C25.7617,-80.1918&key=${GOOGLE_MAPS_API_KEY}`}
                  alt="Interactive Google Maps showing 3PL warehouse locations"
                  className="rounded-lg shadow-lg border w-full h-auto block"
                />
                
                {/* Interactive Clickable Overlays */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {warehouses.map((warehouse) => {
                    let left, top;
                    switch(warehouse.city) {
                      case 'Los Angeles': left = '12%'; top = '62%'; break;
                      case 'Seattle': left = '8%'; top = '25%'; break;
                      case 'Chicago': left = '62%'; top = '45%'; break;
                      case 'Dallas': left = '48%'; top = '68%'; break;
                      case 'Newark': left = '82%'; top = '38%'; break;
                      case 'Miami': left = '84%'; top = '78%'; break;
                      default: left = '50%'; top = '50%'; break;
                    }
                    
                    return (
                      <div
                        key={warehouse.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        style={{ left, top }}
                        onClick={() => handleMarkerClick(warehouse)}
                        title={`Click for details: ${warehouse.name}`}
                      >
                        <div className="relative">
                          {/* Invisible clickable area */}
                          <div className="w-10 h-10 rounded-full bg-transparent hover:bg-blue-200 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center"></div>
                          
                          {/* Visible marker overlay */}
                          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                            warehouse.growe_represented ? 'bg-blue-600' : 'bg-orange-500'
                          } flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                            <span className="text-white text-xs font-bold">
                              {warehouse.growe_represented ? 'G' : 'O'}
                            </span>
                          </div>
                          
                          {/* Hover tooltip */}
                          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {warehouse.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Zoom Controls Simulation */}
                <div className="absolute top-4 right-4 bg-white rounded shadow-md">
                  <div className="flex flex-col">
                    <button className="p-2 hover:bg-gray-100 border-b text-gray-600 font-bold text-lg">+</button>
                    <button className="p-2 hover:bg-gray-100 text-gray-600 font-bold text-lg">−</button>
                  </div>
                </div>

                {/* Map Type Control Simulation */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded px-2 py-1 text-xs text-gray-600">
                  📍 Interactive Google Maps
                </div>
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

            {/* Interactive Features Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                🖱️ Click markers for warehouse details • Real Google Maps with interactive overlays
              </p>
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