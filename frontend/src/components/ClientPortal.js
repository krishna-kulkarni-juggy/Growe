import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import {
  Building,
  FileText,
  Inbox,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';

const ClientPortal = () => {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [leases, setLeases] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo data for 3PL partner view
    const demoWarehouses = [
      {
        id: "1",
        threepl_id: "partner1",
        name: "Summit LA Distribution Center",
        address: "1234 Industrial Blvd",
        city: "Los Angeles", 
        state: "CA",
        zip_code: "90021",
        growe_represented: true
      }
    ];

    const demoLeases = [
      {
        id: "1",
        warehouse_id: "1",
        threepl_id: "partner1",
        start_date: new Date(Date.now() - 365 * 2 * 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        square_footage: 50000,
        landlord: "Property Group 1",
        monthly_rent: 25000,
        status: "Active"
      }
    ];

    const demoLeads = [
      {
        id: "1",
        company_name: "TechStart Electronics",
        contact_name: "Alex Johnson",
        email: "alex@techstart.com",
        phone: "(555) 111-2222",
        product_type: "Consumer Electronics",
        regions_needed: ["California", "Texas"],
        monthly_shipments: 500,
        urgency: "High",
        created_at: new Date()
      }
    ];

    setWarehouses(demoWarehouses);
    setLeases(demoLeases); 
    setLeads(demoLeads);
    setLoading(false);
  }, []);

  const getDaysUntilExpiration = (endDate) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getLeaseStatus = (lease) => {
    const daysUntilExpiry = getDaysUntilExpiration(lease.end_date);
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 180) return 'expiring';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring': return 'bg-orange-100 text-orange-800';
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Portal</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Manage your warehouse locations, leases, and leads from Growe.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Leases</p>
              <p className="text-2xl font-bold text-gray-900">
                {leases.filter(l => getLeaseStatus(l) === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-500">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {leases.filter(l => getLeaseStatus(l) === 'expiring').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500">
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">New Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Warehouse Locations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Warehouse Locations</h2>
          <div className="space-y-4">
            {warehouses.length > 0 ? (
              warehouses.map((warehouse) => (
                <div key={warehouse.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {warehouse.name}
                      </h3>
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
                      {warehouse.growe_represented ? 'Growe Represented' : 'Not Represented'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No warehouse locations found.</p>
            )}
          </div>
        </div>

        {/* Lease Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lease Information</h2>
          <div className="space-y-4">
            {leases.length > 0 ? (
              leases.map((lease) => {
                const warehouse = warehouses.find(w => w.id === lease.warehouse_id);
                const status = getLeaseStatus(lease);
                const daysUntilExpiry = getDaysUntilExpiration(lease.end_date);

                return (
                  <div key={lease.id} className={`border rounded-lg p-4 ${
                    status === 'expiring' ? 'border-orange-300 bg-orange-50' :
                    status === 'expired' ? 'border-red-300 bg-red-50' :
                    'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {warehouse?.name || 'Unknown Warehouse'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {warehouse?.city}, {warehouse?.state}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Square Footage:</p>
                        <p className="font-medium">{lease.square_footage?.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Rent:</p>
                        <p className="font-medium">${lease.monthly_rent?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Expires: {new Date(lease.end_date).toLocaleDateString()}
                      </div>
                      <div className={`text-sm ${
                        daysUntilExpiry < 0 ? 'text-red-600' : 
                        daysUntilExpiry <= 180 ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        {daysUntilExpiry < 0 
                          ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                          : `${daysUntilExpiry} days remaining`
                        }
                      </div>
                    </div>

                    {status === 'expiring' && (
                      <div className="mt-3 p-2 bg-orange-100 rounded-md">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                          <p className="text-sm text-orange-800">
                            Lease renewal needed soon. Contact your Growe representative.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No lease information available.</p>
            )}
          </div>
        </div>

        {/* Leads from Growe */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Leads Delivered by Growe</h2>
          <div className="space-y-4">
            {leads.length > 0 ? (
              leads.map((lead) => (
                <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{lead.company_name}</h3>
                      <p className="text-sm text-gray-600">{lead.contact_name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.urgency === 'High' ? 'bg-red-100 text-red-800' :
                        lead.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.urgency} Priority
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Product Type:</p>
                      <p className="font-medium">{lead.product_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Monthly Volume:</p>
                      <p className="font-medium">{lead.monthly_shipments?.toLocaleString()} shipments</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Regions:</p>
                      <p className="font-medium">{lead.regions_needed?.join(', ')}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Inbox className="h-4 w-4 mr-1" />
                      Contact: {lead.email} • {lead.phone}
                    </div>
                    <button className="btn-primary text-sm">
                      Contact Lead
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No leads yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  New shipper leads will appear here when they match your capabilities.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;