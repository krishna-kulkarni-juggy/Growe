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
  X,
  FileCheck,
  Printer
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
          document_content: `
COMMERCIAL LEASE AGREEMENT

Property: Summit LA Distribution Center
Address: 1234 Industrial Blvd, Los Angeles, CA 90021
Landlord: Property Group 1 LLC
Tenant: Summit Logistics Inc.

LEASE TERMS:
- Initial Term: 3 years (Jan 1, 2022 - Dec 31, 2024)
- Monthly Rent: $25,000 (Year 1), 3% annual escalation
- Square Footage: 50,000 sq ft
- Security Deposit: $50,000
- Use: Warehouse and distribution operations

KEY PROVISIONS:
1. RENEWAL OPTION: Tenant has automatic renewal option for additional 2 years
2. MAINTENANCE: Tenant responsible for interior maintenance, landlord for structural
3. INSURANCE: Tenant must maintain $2M commercial liability insurance
4. PARKING: 25 dedicated parking spaces included
5. LOADING DOCKS: 8 dock doors with hydraulic levelers

SPECIAL TERMS:
- Option to expand to adjacent 25,000 sq ft space with 90-day notice
- Early termination allowed after Year 2 with 180-day notice and 2-month penalty
- Annual facility inspection required every December

CONTACT INFORMATION:
Landlord: Property Group 1 LLC, (555) 123-0001, admin@propgroup1.com
Property Manager: Jane Wilson, (555) 123-0002, jane.wilson@propgroup1.com
`,
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
          document_content: `
INDUSTRIAL WAREHOUSE LEASE AGREEMENT

Property: Atlantic Newark Industrial Hub  
Address: 9101 Commerce Dr, Newark, NJ 07102
Landlord: Industrial Properties LLC
Tenant: Atlantic Supply Chain Corp.

LEASE TERMS:
- Term: 5 years (March 1, 2021 - February 28, 2026)
- Base Rent: $35,000/month (fixed for 2 years, then 2.5% annual increases)
- Square Footage: 75,000 sq ft
- Security Deposit: $70,000
- Additional Rent: Property taxes, insurance, common area maintenance

FACILITY SPECIFICATIONS:
- Clear height: 32 feet
- Loading docks: 12 dock doors with truck wells
- Drive-in doors: 2 grade-level doors
- Parking: 50 dedicated spaces
- Office space: 5,000 sq ft included

LANDLORD RESPONSIBILITIES:
- Structural maintenance and roof repairs
- HVAC system maintenance and replacement
- Exterior building maintenance
- Common area lighting and maintenance

TENANT RESPONSIBILITIES:
- Interior maintenance and repairs
- Utilities (electric, gas, water, sewer)
- Interior lighting and HVAC operation
- Security system operation

SPECIAL PROVISIONS:
- Right of first refusal on adjacent 25,000 sq ft space
- No early termination clause - full term required
- Annual rent reconciliation for property taxes and insurance
- Tenant improvements allowance: $50,000

CONTACT INFORMATION:
Landlord: Industrial Properties LLC, (555) 234-0001, leasing@indprop.com
Property Manager: Robert Chen, (555) 234-0002, r.chen@indprop.com
`,
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
          document_content: `
SHORT-TERM WAREHOUSE LEASE AGREEMENT

Property: Chicago Logistics Hub - Building C
Address: 2345 Logistics Ave, Chicago, IL 60632
Landlord: Chicago Industrial Partners
Tenant: Summit Logistics Inc.

LEASE TERMS:
- Initial Term: 2 years (April 1, 2023 - March 31, 2025)  
- Base Rent: $18,000/month + revenue percentage
- Square Footage: 40,000 sq ft
- Security Deposit: $36,000
- Revenue Share: 2% of gross revenue over $1,000,000 annually

REVENUE-BASED RENT STRUCTURE:
- Base rent applies to first $1M in annual gross revenue
- Additional rent: 2% of revenue from $1M - $5M
- Additional rent: 1.5% of revenue over $5M
- Monthly revenue reporting required by 15th of following month

SHARED FACILITIES:
- Loading dock: 4 shared dock doors (scheduled access)
- Common break room and restrooms
- Shared truck parking area (10 spaces allocated)
- Common security system and entrance

EXPANSION OPTION:
- First right to lease adjacent 20,000 sq ft space
- Same terms and revenue structure apply
- 60-day advance notice required for expansion

TERMINATION CLAUSES:
- Either party may terminate with 60-day written notice
- Month-to-month option available after initial term
- Early termination fee: 2 months base rent if terminated before 18 months

REPORTING REQUIREMENTS:
- Monthly revenue reports due by 15th of following month  
- Annual audited financials required
- Quarterly business review meetings with landlord

CONTACT INFORMATION:
Landlord: Chicago Industrial Partners, (555) 345-0001, info@chiplogistics.com  
Leasing Manager: Sarah Martinez, (555) 345-0002, s.martinez@chiplogistics.com
`,
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
                  Action Items
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {lease.lease_agreement?.summary?.action_items?.slice(0, 2).map((item, index) => (
                          <div key={index} className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(item.priority)}`}>
                            {item.type === 'renewal_notice' && '🔄'}
                            {item.type === 'renewal_decision' && '⚠️'}
                            {item.type === 'insurance_renewal' && '🛡️'}
                            {item.type === 'maintenance_inspection' && '🔧'}
                            {item.type === 'rent_review' && '💰'}
                            {item.type === 'hvac_maintenance' && '🌡️'}
                            {item.type === 'revenue_report' && '📊'}
                            <span className="ml-1">
                              {item.description.length > 25 ? item.description.substring(0, 25) + '...' : item.description}
                            </span>
                          </div>
                        ))}
                        {lease.lease_agreement?.summary?.action_items?.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{lease.lease_agreement.summary.action_items.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewLeaseDetails(lease)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        {(status === 'expiring' || status === 'expired') && (
                          <button
                            onClick={() => sendReminder(lease)}
                            className="text-orange-600 hover:text-orange-900 flex items-center"
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Send Reminder
                          </button>
                        )}
                      </div>
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

      {/* Lease Details Modal */}
      {showLeaseModal && selectedLease && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Lease Agreement Details</h2>
                <button
                  onClick={() => setShowLeaseModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Warehouse</p>
                      <p className="font-medium">{getWarehouseInfo(selectedLease.warehouse_id)?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">3PL Partner</p>
                      <p className="font-medium">{getThreePLInfo(selectedLease.threepl_id)?.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lease Document</p>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        <p className="font-medium text-blue-600">{selectedLease.lease_agreement?.document_name}</p>
                        <Download className="h-4 w-4 ml-2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Total Annual Cost</p>
                      <p className="text-xl font-bold text-green-600">
                        ${selectedLease.lease_agreement?.summary?.financial_summary?.total_annual_cost?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Escalation Rate</p>
                      <p className="font-medium">{selectedLease.lease_agreement?.summary?.financial_summary?.escalation_rate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Security Deposit</p>
                      <p className="font-medium">${selectedLease.lease_agreement?.summary?.financial_summary?.deposit_amount?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Terms */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Lease Terms</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {selectedLease.lease_agreement?.summary?.key_terms?.map((term, index) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Items */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items</h3>
                <div className="space-y-3">
                  {selectedLease.lease_agreement?.summary?.action_items?.map((item, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      item.priority === 'critical' ? 'border-red-300 bg-red-50' :
                      item.priority === 'high' ? 'border-orange-300 bg-orange-50' :
                      item.priority === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                      'border-blue-300 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                              {item.priority.toUpperCase()} PRIORITY
                            </span>
                            {item.status === 'completed' && (
                              <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 mt-2">{item.description}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Due: {new Date(item.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        {item.status !== 'completed' && (
                          <button
                            onClick={() => markActionItemComplete(selectedLease.id, index)}
                            className="ml-4 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Fees */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Fees & Responsibilities</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedLease.lease_agreement?.summary?.financial_summary?.additional_fees?.map((fee, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                        {fee}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowLeaseModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseAdmin;