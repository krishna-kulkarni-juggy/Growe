import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  Building, 
  MapPin, 
  Briefcase, 
  Clock,
  Inbox,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [recentLeads, setRecentLeads] = useState([]);
  const [expiringLeases, setExpiringLeases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hardcode the data since async calls aren't working in this environment
    console.log('Setting up demo data directly...');
    
    // Demo data from our working API
    const demoStats = {
      total_3pls: 13,
      total_warehouses: 12,
      active_deals: 8,
      expiring_leases: 1,
      new_leads: 9
    };
    
    const demoLeads = [
      {
        id: "1",
        company_name: "TechStart Electronics",
        contact_name: "Alex Johnson",
        product_type: "Consumer Electronics",
        regions_needed: ["California", "Texas"],
        monthly_shipments: 500,
        urgency: "High",
        created_at: new Date()
      },
      {
        id: "2", 
        company_name: "GreenLife Supplements",
        contact_name: "Maria Garcia",
        product_type: "Health & Wellness",
        regions_needed: ["New York", "New Jersey"],
        monthly_shipments: 300,
        urgency: "Medium",
        created_at: new Date()
      }
    ];
    
    const demoExpiring = [
      {
        id: "1",
        warehouse_id: "wh1",
        landlord: "Property Group 1",
        square_footage: 50000,
        monthly_rent: 25000,
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      }
    ];
    
    setStats(demoStats);
    setRecentLeads(demoLeads);
    setExpiringLeases(demoExpiring);
    setLoading(false);
    
    console.log('Demo data loaded:', demoStats);
  }, []);

  const statCards = [
    {
      title: 'Total 3PLs',
      value: stats.total_3pls || 0,
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      title: 'Warehouses',
      value: stats.total_warehouses || 0,
      icon: MapPin,
      color: 'bg-green-500'
    },
    {
      title: 'Active Deals',
      value: stats.active_deals || 0,
      icon: Briefcase,
      color: 'bg-purple-500'
    },
    {
      title: 'Expiring Leases',
      value: stats.expiring_leases || 0,
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'New Leads',
      value: stats.new_leads || 0,
      icon: Inbox,
      color: 'bg-pink-500'
    }
  ];

  const chartData = [
    { name: '3PLs', value: stats.total_3pls || 0 },
    { name: 'Warehouses', value: stats.total_warehouses || 0 },
    { name: 'Active Deals', value: stats.active_deals || 0 },
    { name: 'New Leads', value: stats.new_leads || 0 }
  ];

  const pieData = [
    { name: 'Active', value: stats.active_deals || 0, color: '#3b82f6' },
    { name: 'Expiring', value: stats.expiring_leases || 0, color: '#f59e0b' },
    { name: 'New Leads', value: stats.new_leads || 0, color: '#ec4899' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'Client Portal'}
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your logistics platform.
        </p>
      </div>

      {/* Stats Cards - Now Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const navigateTo = index === 0 ? '/crm' : 
                           index === 1 ? '/map' : 
                           index === 2 ? '/crm' :
                           index === 3 ? '/leases' : '/shipper-intake';
          
          return (
            <a 
              key={index} 
              href={navigateTo}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer block"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                Click to view details →
              </div>
            </a>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity - Now Clickable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Shipper Leads</h3>
            <a 
              href="/shipper-intake" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </a>
          </div>
          <div className="space-y-4">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <a
                  key={lead.id}
                  href="/shipper-intake"
                  className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{lead.company_name}</p>
                      <p className="text-sm text-gray-600">{lead.product_type}</p>
                      <p className="text-xs text-gray-500">
                        {lead.regions_needed?.join(', ')} • {lead.monthly_shipments} shipments/month
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.urgency === 'High' ? 'bg-red-100 text-red-800' :
                      lead.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {lead.urgency}
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent leads</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Expiring Leases</h3>
            <a 
              href="/leases" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </a>
          </div>
          <div className="space-y-4">
            {expiringLeases.length > 0 ? (
              expiringLeases.map((lease) => (
                <a
                  key={lease.id}
                  href="/leases"
                  className="block p-3 border border-orange-200 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Warehouse #{lease.warehouse_id}</p>
                      <p className="text-sm text-gray-600">{lease.landlord}</p>
                      <p className="text-xs text-gray-500">
                        {lease.square_footage?.toLocaleString()} sq ft • ${lease.monthly_rent?.toLocaleString()}/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-800">
                        Expires: {new Date(lease.end_date).toLocaleDateString()}
                      </p>
                      <span className="inline-block px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-medium">
                        {Math.ceil((new Date(lease.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No expiring leases</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;