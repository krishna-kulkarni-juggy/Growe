import React, { useState, useEffect } from 'react';
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

  const handleWarehouseClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setSidebarOpen(true);
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
        {/* Map Placeholder with Warehouse Markers */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 relative border-2 border-dashed border-gray-300">
            {/* Map Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Interactive Map View</h3>
                <p className="text-sm text-gray-500 mb-4">Google Maps integration would display here</p>
                <p className="text-xs text-gray-400">Click warehouse cards below to view details</p>
              </div>
            </div>

            {/* Simulated Map Markers */}
            <div className="absolute top-1/4 left-1/4">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute top-1/3 right-1/3">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute bottom-1/3 left-1/2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="absolute top-1/2 left-1/3">
              <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Warehouse List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {warehouses.map((warehouse) => {
            const threePL = getThreePLInfo(warehouse.threepl_id);
            return (
              <div
                key={warehouse.id}
                onClick={() => handleWarehouseClick(warehouse)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  warehouse.growe_represented 
                    ? 'border-blue-200 bg-blue-50 hover:border-blue-300' 
                    : 'border-orange-200 bg-orange-50 hover:border-orange-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {warehouse.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {warehouse.address}<br />
                      {warehouse.city}, {warehouse.state} {warehouse.zip_code}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    warehouse.growe_represented 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {warehouse.growe_represented ? 'Growe Rep.' : 'Not Rep.'}
                  </span>
                </div>

                {threePL && (
                  <div className="mt-3 p-3 bg-white rounded border">
                    <p className="font-medium text-gray-900 text-sm">{threePL.company_name}</p>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {threePL.email}
                    </p>
                    <p className="text-xs text-gray-600 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {threePL.phone}
                    </p>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {threePL.services?.slice(0, 2).map((service, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {service}
                          </span>
                        ))}
                        {threePL.services?.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{threePL.services.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar for Selected Warehouse */}
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