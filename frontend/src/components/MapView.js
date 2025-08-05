import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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
    // Demo data since async operations don't work in this environment
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
        regions_covered: ["California", "Nevada", "Arizona"],
        status: "Engaged",
        notes: "Key partner with 5 facilities across the West Coast"
      },
      {
        id: "2",
        company_name: "Atlantic Supply Chain", 
        primary_contact: "Mike Davis",
        email: "mdavis@atlanticsupply.com",
        phone: "(555) 234-5678",
        services: ["Warehousing", "Cross-docking", "LTL"],
        regions_covered: ["New York", "New Jersey", "Pennsylvania"],
        status: "Matched",
        notes: "Specialized in e-commerce fulfillment"
      }
    ];

    setWarehouses(demoWarehouses);
    setThreePLs(demoThreePLs);
    setLoading(false);
  }, []);

  const getThreePLInfo = (threeplId) => {
    return threePLs.find(tpl => tpl.id === threeplId);
  };

  const handleMarkerClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setSidebarOpen(true);
  };

  const getMarkerIcon = (warehouse) => {
    return {
      url: warehouse.growe_represented 
        ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 7L12 12L2 7L12 2Z" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
            <path d="M2 17L12 22L22 17" stroke="#3B82F6" stroke-width="2"/>
            <path d="M2 12L12 17L22 12" stroke="#3B82F6" stroke-width="2"/>
          </svg>
        `)
        : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L22 7L12 12L2 7L12 2Z" fill="#F59E0B" stroke="#ffffff" stroke-width="2"/>
            <path d="M2 17L12 22L22 17" stroke="#F59E0B" stroke-width="2"/>
            <path d="M2 12L12 17L22 12" stroke="#F59E0B" stroke-width="2"/>
          </svg>
        `),
      scaledSize: new window.google.maps.Size(32, 32),
      anchor: new window.google.maps.Point(16, 32)
    };
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
          Interactive map showing all 3PL warehouse locations across North America
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Growe Represented</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Not Represented</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <LoadScript 
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
            loadingElement={<div className="h-96 flex items-center justify-center">Loading map...</div>}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={4}
              options={mapOptions}
            >
              {warehouses.map((warehouse) => (
                <Marker
                  key={warehouse.id}
                  position={{ lat: warehouse.lat, lng: warehouse.lng }}
                  onClick={() => handleMarkerClick(warehouse)}
                  icon={getMarkerIcon(warehouse)}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Warehouse Details</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {selectedWarehouse && (
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
          )}
        </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
          <p className="text-3xl font-bold text-orange-600">
            {warehouses.filter(w => !w.growe_represented).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapView;