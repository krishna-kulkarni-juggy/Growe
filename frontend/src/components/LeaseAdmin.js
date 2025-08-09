import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  Calendar, 
  Building,
  FileText,
  AlertTriangle,
  Bell,
  Eye,
  Download,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const LeaseAdmin = () => {
  const [leases, setLeases] = useState([]);
  const [expiringLeases, setExpiringLeases] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [threePLs, setThreePLs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, expiring, active
  const [selectedLease, setSelectedLease] = useState(null);
  const [showLeaseModal, setShowLeaseModal] = useState(false);

  useEffect(() => {
    // Enhanced demo data with lease agreements and summaries
    const demoLeases = [
      {
        id: "1",
        warehouse_id: "wh1",
        threepl_id: "tpl1",
        start_date: new Date(Date.now() - 365 * 2 * 24 * 60 * 60 * 1000), // 2 years ago
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        renewal_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        square_footage: 50000,
        landlord: "Property Group 1",
        monthly_rent: 25000,
        status: "Active",
        notes: "Standard warehouse lease",
        lease_agreement: {
          document_name: "Summit_LA_Warehouse_Lease_2022.pdf",
          summary: {
            key_terms: [
              "3-year initial term with automatic 2-year renewal option",
              "Annual rent escalation of 3% starting Year 2",
              "Tenant responsible for utilities, maintenance, and property taxes",
              "90-day notice required for lease termination",
              "Option to expand to adjacent 25,000 sq ft space"
            ],
            action_items: [
              {
                type: "renewal_notice",
                description: "Provide renewal decision notice to landlord",
                due_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                priority: "high",
                status: "pending"
              },
              {
                type: "insurance_renewal",
                description: "Update liability insurance certificate",
                due_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                priority: "medium",
                status: "pending"
              },
              {
                type: "maintenance_inspection",
                description: "Annual facility maintenance inspection",
                due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                priority: "low",
                status: "pending"
              }
            ],
            financial_summary: {
              total_annual_cost: 300000,
              escalation_rate: "3% annually",
              deposit_amount: 50000,
              additional_fees: ["Property tax", "Utilities", "Maintenance"]
            }
          }
        }
      },
      {
        id: "2", 
        warehouse_id: "wh2",
        threepl_id: "tpl2",
        start_date: new Date(Date.now() - 365 * 3 * 24 * 60 * 60 * 1000), // 3 years ago
        end_date: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000), // 300 days from now
        renewal_date: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000), // 270 days from now
        square_footage: 75000,
        landlord: "Industrial Properties LLC",
        monthly_rent: 35000,
        status: "Active",
        notes: "Prime location with good access",
        lease_agreement: {
          document_name: "Atlantic_Newark_Industrial_Lease_2021.pdf",
          summary: {
            key_terms: [
              "5-year fixed term with no early termination clause",
              "Fixed rent for first 2 years, then 2.5% annual increases",
              "Landlord covers structural maintenance and roof repairs",
              "Tenant has right of first refusal on adjacent properties",
              "Includes 50 dedicated parking spaces and truck dock access"
            ],
            action_items: [
              {
                type: "rent_review",
                description: "Annual rent adjustment calculation review",
                due_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
                priority: "medium",
                status: "pending"
              },
              {
                type: "hvac_maintenance",
                description: "Quarterly HVAC system maintenance",
                due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                priority: "high",
                status: "pending"
              }
            ],
            financial_summary: {
              total_annual_cost: 420000,
              escalation_rate: "2.5% after Year 2",
              deposit_amount: 70000,
              additional_fees: ["Utilities", "Interior maintenance", "Security"]
            }
          }
        }
      },
      {
        id: "3",
        warehouse_id: "wh3",
        threepl_id: "tpl1",
        start_date: new Date(Date.now() - 365 * 1 * 24 * 60 * 60 * 1000), // 1 year ago
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        renewal_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        square_footage: 40000,
        landlord: "Chicago Industrial Partners",
        monthly_rent: 18000,
        status: "Active",
        notes: "Short-term lease with expansion potential",
        lease_agreement: {
          document_name: "Chicago_Logistics_Hub_Lease_2023.pdf",
          summary: {
            key_terms: [
              "2-year initial term with month-to-month option after",
              "Base rent plus percentage of revenue over $1M annually",
              "Shared loading dock facilities with other tenants",
              "60-day notice required for termination",
              "Option to lease additional 20,000 sq ft in same complex"
            ],
            action_items: [
              {
                type: "renewal_decision",
                description: "URGENT: Make renewal decision for expiring lease",
                due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                priority: "critical",
                status: "pending"
              },
              {
                type: "revenue_report",
                description: "Submit annual revenue report for rent calculation",
                due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                priority: "high",
                status: "pending"
              }
            ],
            financial_summary: {
              total_annual_cost: 216000,
              escalation_rate: "Revenue-based adjustment",
              deposit_amount: 36000,
              additional_fees: ["Revenue percentage", "Shared dock fees", "Utilities"]
            }
          }
        }
      }
    ];

    const demoWarehouses = [
      {
        id: "wh1",
        name: "Summit LA Distribution Center",
        city: "Los Angeles",
        state: "CA"
      },
      {
        id: "wh2",
        name: "Atlantic Newark Hub", 
        city: "Newark",
        state: "NJ"
      },
      {
        id: "wh3",
        name: "Chicago Logistics Hub",
        city: "Chicago", 
        state: "IL"
      }
    ];

    const demoThreePLs = [
      {
        id: "tpl1",
        company_name: "Summit Logistics",
        primary_contact: "John Smith"
      },
      {
        id: "tpl2",
        company_name: "Atlantic Supply Chain",
        primary_contact: "Mike Davis"
      }
    ];

    setLeases(demoLeases);
    setExpiringLeases(demoLeases.filter(l => getDaysUntilExpiration(l.end_date) <= 180));
    setWarehouses(demoWarehouses);
    setThreePLs(demoThreePLs);
    setLoading(false);
  }, []);

  const getWarehouseInfo = (warehouseId) => {
    return warehouses.find(w => w.id === warehouseId);
  };

  const getThreePLInfo = (threeplId) => {
    return threePLs.find(tpl => tpl.id === threeplId);
  };

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
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'expiring': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRowColor = (lease) => {
    const status = getLeaseStatus(lease);
    switch (status) {
      case 'expired': return 'bg-red-50 border-l-4 border-l-red-500';
      case 'expiring': return 'bg-orange-50 border-l-4 border-l-orange-500';
      default: return 'bg-white';
    }
  };

  const sendReminder = async (lease) => {
    try {
      // This would integrate with email/SMS service
      toast.success(`Reminder sent for lease ${lease.id}`);
    } catch (error) {
      toast.error('Failed to send reminder');
    }
  };

  const viewLeaseDetails = (lease) => {
    setSelectedLease(lease);
    setShowLeaseModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const markActionItemComplete = (leaseId, actionIndex) => {
    setLeases(prevLeases => 
      prevLeases.map(lease => {
        if (lease.id === leaseId) {
          const updatedActionItems = [...lease.lease_agreement.summary.action_items];
          updatedActionItems[actionIndex] = {
            ...updatedActionItems[actionIndex],
            status: 'completed'
          };
          return {
            ...lease,
            lease_agreement: {
              ...lease.lease_agreement,
              summary: {
                ...lease.lease_agreement.summary,
                action_items: updatedActionItems
              }
            }
          };
        }
        return lease;
      })
    );
    toast.success('Action item marked as complete');
  };

  const filteredLeases = leases.filter(lease => {
    if (filter === 'expiring') {
      return getDaysUntilExpiration(lease.end_date) <= 180 && getDaysUntilExpiration(lease.end_date) >= 0;
    }
    if (filter === 'active') {
      return getDaysUntilExpiration(lease.end_date) > 180;
    }
    return true; // all
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 rounded mb-4"></div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Lease Administration</h1>
        <p className="text-gray-600 mt-2">
          Track warehouse lease agreements and manage renewal dates
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leases</p>
              <p className="text-2xl font-bold text-gray-900">{leases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500">
              <Building className="h-6 w-6 text-white" />
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
              <p className="text-2xl font-bold text-gray-900">{expiringLeases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">
                {leases.filter(l => getLeaseStatus(l) === 'expired').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Leases', count: leases.length },
              { key: 'expiring', label: 'Expiring Soon', count: expiringLeases.length },
              { key: 'active', label: 'Active', count: leases.filter(l => getLeaseStatus(l) === 'active').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Lease Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  3PL Partner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeases.map((lease) => {
                const warehouse = getWarehouseInfo(lease.warehouse_id);
                const threepl = getThreePLInfo(lease.threepl_id);
                const status = getLeaseStatus(lease);
                const daysUntilExpiry = getDaysUntilExpiration(lease.end_date);

                return (
                  <tr key={lease.id} className={getRowColor(lease)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {warehouse?.name || 'Unknown Warehouse'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {warehouse?.city}, {warehouse?.state}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {threepl?.company_name || 'Unknown Company'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {threepl?.primary_contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lease.square_footage?.toLocaleString()} sq ft
                      </div>
                      <div className="text-sm text-gray-500">
                        ${lease.monthly_rent?.toLocaleString()}/month
                      </div>
                      <div className="text-sm text-gray-500">
                        Landlord: {lease.landlord}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(lease.end_date).toLocaleDateString()}
                      </div>
                      <div className={`text-sm ${daysUntilExpiry < 0 ? 'text-red-600' : daysUntilExpiry <= 180 ? 'text-orange-600' : 'text-green-600'}`}>
                        {daysUntilExpiry < 0 
                          ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                          : `${daysUntilExpiry} days remaining`
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(status === 'expiring' || status === 'expired') && (
                        <button
                          onClick={() => sendReminder(lease)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Bell className="h-4 w-4 mr-1" />
                          Send Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredLeases.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md mt-6">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leases found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'expiring' 
              ? 'No leases are expiring in the next 6 months.'
              : filter === 'active'
              ? 'No active leases found.'
              : 'No lease records available.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaseAdmin;