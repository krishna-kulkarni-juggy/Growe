import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  Building,
  FileText,
  Inbox,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  Newspaper,
  ArrowRight,
  X
} from 'lucide-react';

const ClientPortal = () => {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [leases, setLeases] = useState([]);
  const [leads, setLeads] = useState([]);
  const [industryNews, setIndustryNews] = useState([]);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
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

    const demoIndustryNews = [
      {
        id: "1",
        title: "3PL Market Expected to Reach $1.7 Trillion by 2027",
        summary: "Strong e-commerce growth drives unprecedented expansion in third-party logistics sector, creating new opportunities for warehouse operators.",
        full_content: `
The third-party logistics (3PL) market is experiencing unprecedented growth, with industry analysts projecting the global market to reach $1.7 trillion by 2027, representing a compound annual growth rate (CAGR) of 8.5% from 2022 to 2027.

KEY DRIVERS OF GROWTH:

E-commerce Explosion: Online retail sales continue to surge, with consumers increasingly expecting faster delivery times and seamless fulfillment experiences. This trend has accelerated since the pandemic and shows no signs of slowing.

Supply Chain Complexity: Modern supply chains have become increasingly complex, with companies seeking specialized expertise to navigate international trade, regulatory compliance, and last-mile delivery challenges.

Technology Integration: Advanced technologies like AI, IoT, and robotic process automation are transforming warehouse operations, making 3PL services more efficient and cost-effective.

REGIONAL MARKET ANALYSIS:

North America: Expected to maintain its position as the largest regional market, driven by robust e-commerce growth and the need for sophisticated cold chain logistics.

Asia-Pacific: Projected to show the fastest growth rate, particularly in China and India, where rapid urbanization and middle-class expansion fuel consumer demand.

Europe: Steady growth expected, with emphasis on sustainable logistics practices and green supply chain solutions.

OPPORTUNITIES FOR 3PL PROVIDERS:

1. Specialized Services: Growing demand for temperature-controlled storage, pharmaceutical logistics, and hazardous materials handling.

2. Technology Adoption: Companies investing in automation and data analytics are seeing significant competitive advantages.

3. Sustainability Focus: Eco-friendly logistics solutions are becoming a key differentiator in client selection.

4. Last-Mile Innovation: Urban fulfillment centers and alternative delivery methods present new revenue streams.

CHALLENGES TO CONSIDER:

- Rising real estate costs in key logistics markets
- Persistent labor shortages and increasing wage pressures  
- Need for substantial technology investments
- Regulatory compliance in international markets

EXPERT PERSPECTIVE:
"The 3PL industry is at an inflection point," says Maria Rodriguez, Senior Analyst at Supply Chain Insights. "Companies that can successfully integrate advanced technology while maintaining operational flexibility will capture the largest share of this growth."

INVESTMENT IMPLICATIONS:
This growth trajectory presents significant opportunities for warehouse operators, technology providers, and investors focused on logistics infrastructure. The key will be positioning for the shift toward more automated, sustainable, and customer-centric operations.
        `,
        source: "Logistics Management",
        category: "Market Trends",
        published_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read_time: "3 min",
        trending: true,
        author: "Jennifer Smith",
        tags: ["Market Analysis", "E-commerce", "Growth Forecast"]
      },
      {
        id: "2", 
        title: "Automation Revolution Transforms Warehouse Operations",
        summary: "Leading 3PLs invest heavily in robotics and AI technologies to meet growing demand while managing labor shortages.",
        full_content: `
The warehouse automation revolution is accelerating at an unprecedented pace, with leading 3PL providers investing billions in robotics, artificial intelligence, and automated systems to transform their operations.

CURRENT STATE OF AUTOMATION:

Market Size: The warehouse automation market is valued at $15.3 billion in 2023 and is expected to reach $30.8 billion by 2028, growing at a CAGR of 15.1%.

Adoption Rates: Currently, only 15% of warehouses globally have implemented significant automation, leaving enormous room for growth and competitive differentiation.

LEADING TECHNOLOGIES:

1. Autonomous Mobile Robots (AMRs)
   - Reduce picking times by up to 50%
   - Improve accuracy to 99.9%
   - Enable 24/7 operations without human intervention

2. Automated Storage and Retrieval Systems (AS/RS)
   - Maximize vertical space utilization
   - Reduce labor costs by 60-70%
   - Eliminate picking errors

3. AI-Powered Warehouse Management Systems
   - Predictive analytics for demand forecasting
   - Dynamic routing optimization
   - Real-time inventory optimization

4. Voice-Directed Operations
   - Hands-free picking and packing
   - 15-20% productivity improvement
   - Reduced training time for new workers

CASE STUDIES:

Amazon Robotics: Deployed over 520,000 robotic units across fulfillment centers, reducing operating expenses by 20% and improving delivery speed.

DHL Supply Chain: Implemented collaborative robots (cobots) that work alongside human workers, increasing productivity by 25% while maintaining employment levels.

UPS: Invested $200 million in automated sorting facilities, processing 100,000 packages per hour with 99.97% accuracy.

LABOR IMPACT AND CONSIDERATIONS:

Job Transformation: While automation eliminates some manual tasks, it creates new roles in robot maintenance, data analysis, and system management.

Skill Development: 3PL providers are investing heavily in retraining programs to help workers transition to higher-skilled positions.

Hybrid Approach: Most successful implementations combine automation with human workers, leveraging the strengths of both.

ROI AND FINANCIAL BENEFITS:

- Typical payback period: 2-4 years
- Labor cost reduction: 40-60%
- Accuracy improvement: 99.5%+ error-free operations
- Space utilization: 40% increase in storage density

CHALLENGES AND BARRIERS:

High Initial Investment: Advanced automation systems require significant upfront capital, often $2-5 million per facility.

Integration Complexity: Existing warehouse management systems may require substantial upgrades or complete replacement.

Change Management: Successful automation requires comprehensive change management programs for both workers and management.

FUTURE OUTLOOK:

The next five years will see continued advancement in:
- Machine learning algorithms for predictive maintenance
- Integration of IoT sensors for real-time monitoring
- Development of fully autonomous warehouse operations
- Blockchain integration for supply chain transparency

STRATEGIC RECOMMENDATIONS:

For 3PL providers considering automation:
1. Start with pilot programs in high-volume, repetitive operations
2. Invest in worker training and development programs
3. Choose scalable solutions that can grow with business needs
4. Partner with technology providers that offer comprehensive support
5. Develop clear ROI metrics and implementation timelines

The automation revolution is not just about replacing human workers—it's about creating more efficient, accurate, and responsive warehouse operations that can meet the demands of modern commerce.
        `,
        source: "Supply Chain Dive",
        category: "Technology",
        published_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read_time: "5 min",
        trending: true,
        author: "Michael Chen",
        tags: ["Automation", "Robotics", "AI", "Labor"]
      },
      {
        id: "3",
        title: "West Coast Port Congestion Creates Inland Opportunities",
        summary: "Shippers diversify distribution strategies, boosting demand for inland warehouse facilities across the Midwest and South.",
        source: "FreightWaves",
        category: "Infrastructure",
        published_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read_time: "4 min",
        trending: false
      },
      {
        id: "4",
        title: "Same-Day Delivery Drives Urban Warehouse Demand",
        summary: "Retailers seek last-mile facilities closer to consumers, creating premium pricing for urban warehouse space.",
        source: "Modern Materials Handling",
        category: "Market Trends",
        published_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        read_time: "3 min",
        trending: false
      },
      {
        id: "5",
        title: "Sustainability Initiatives Reshape 3PL Industry",
        summary: "Environmental regulations and corporate ESG goals drive adoption of green warehousing practices and electric vehicle fleets.",
        source: "Inbound Logistics",
        category: "Sustainability",
        published_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        read_time: "6 min",
        trending: false
      },
      {
        id: "6",
        title: "Cold Storage Shortage Creates Investment Opportunities",
        summary: "Growing demand for temperature-controlled facilities outpaces supply, leading to record-high lease rates in key markets.",
        source: "Cold Chain Federation",
        category: "Specialized Storage",
        published_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        read_time: "4 min",
        trending: true
      },
      {
        id: "7",
        title: "Data Analytics Transforms 3PL Decision Making",
        summary: "Advanced analytics platforms help logistics providers optimize routes, predict demand, and improve customer satisfaction.",
        source: "Logistics Viewpoints",
        category: "Technology",
        published_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        read_time: "5 min",
        trending: false
      },
      {
        id: "8",
        title: "Labor Challenges Drive Wage Growth in Warehousing",
        summary: "Persistent worker shortages push warehouse wages up 15% year-over-year, impacting 3PL profitability and pricing.",
        source: "Warehouse Management",
        category: "Labor Market",
        published_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        read_time: "4 min",
        trending: false
      },
      {
        id: "9",
        title: "Cross-Border E-Commerce Fuels 3PL Expansion",
        summary: "International online shopping growth creates new opportunities for 3PLs specializing in customs and international fulfillment.",
        source: "Global Trade Magazine",
        category: "International",
        published_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        read_time: "7 min",
        trending: false
      },
      {
        id: "10",
        title: "Micro-Fulfillment Centers Gain Momentum",
        summary: "Compact automated facilities in urban areas enable faster delivery times and reduce transportation costs for retailers.",
        source: "Retail Logistics",
        category: "Urban Logistics",
        published_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        read_time: "3 min",
        trending: false
      }
    ];

    setWarehouses(demoWarehouses);
    setLeases(demoLeases); 
    setLeads(demoLeads);
    setIndustryNews(demoIndustryNews);
    setLoading(false);
  }, []);

  const openNewsModal = (newsItem) => {
    setSelectedNewsItem(newsItem);
    setShowNewsModal(true);
  };

  const closeNewsModal = () => {
    setShowNewsModal(false);
    setSelectedNewsItem(null);
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

        {/* Industry News Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Newspaper className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">3PL Industry News</h2>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                Latest trends & opportunities
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Trending News */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                  🔥 TRENDING
                </span>
                Hot Topics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {industryNews.filter(news => news.trending).slice(0, 2).map((news) => (
                  <div 
                    key={news.id} 
                    className="border border-orange-200 rounded-lg p-4 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
                    onClick={() => openNewsModal(news)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="px-2 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full">
                        {news.category}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {news.read_time}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {news.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {news.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{news.source}</span>
                      <span>{new Date(news.published_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All News Feed */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Latest News Feed</h3>
              <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {industryNews.map((news) => (
                  <div 
                    key={news.id} 
                    className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      news.trending ? 'border-orange-200 bg-orange-25' : 'border-gray-200'
                    }`}
                    onClick={() => openNewsModal(news)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          news.category === 'Market Trends' ? 'bg-blue-100 text-blue-800' :
                          news.category === 'Technology' ? 'bg-green-100 text-green-800' :
                          news.category === 'Infrastructure' ? 'bg-purple-100 text-purple-800' :
                          news.category === 'Sustainability' ? 'bg-emerald-100 text-emerald-800' :
                          news.category === 'Specialized Storage' ? 'bg-indigo-100 text-indigo-800' :
                          news.category === 'Labor Market' ? 'bg-yellow-100 text-yellow-800' :
                          news.category === 'International' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {news.category}
                        </span>
                        {news.trending && (
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                            🔥
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {news.read_time}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {news.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {news.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Newspaper className="h-3 w-3 mr-1" />
                        <span className="font-medium">{news.source}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(news.published_date).toLocaleDateString()}</span>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          openNewsModal(news);
                        }}
                      >
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* News Categories Filter */}
            <div className="mt-6 border-t pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Popular Categories</h4>
              <div className="flex flex-wrap gap-2">
                {['Market Trends', 'Technology', 'Infrastructure', 'Sustainability', 'Labor Market'].map((category) => (
                  <button
                    key={category}
                    className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {category} ({industryNews.filter(news => news.category === category).length})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Original Quick Actions Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <FileText className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Download Lease Documents</h3>
                <p className="text-sm text-gray-600">Access all your lease agreements</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Calendar className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Schedule Inspection</h3>
                <p className="text-sm text-gray-600">Book facility maintenance visits</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Inbox className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900">Contact Support</h3>
                <p className="text-sm text-gray-600">Get help from Growe team</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* News Details Modal */}
      {showNewsModal && selectedNewsItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-full overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedNewsItem.category === 'Market Trends' ? 'bg-blue-100 text-blue-800' :
                      selectedNewsItem.category === 'Technology' ? 'bg-green-100 text-green-800' :
                      selectedNewsItem.category === 'Infrastructure' ? 'bg-purple-100 text-purple-800' :
                      selectedNewsItem.category === 'Sustainability' ? 'bg-emerald-100 text-emerald-800' :
                      selectedNewsItem.category === 'Specialized Storage' ? 'bg-indigo-100 text-indigo-800' :
                      selectedNewsItem.category === 'Labor Market' ? 'bg-yellow-100 text-yellow-800' :
                      selectedNewsItem.category === 'International' ? 'bg-pink-100 text-pink-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedNewsItem.category}
                    </span>
                    {selectedNewsItem.trending && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        🔥 TRENDING
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedNewsItem.title}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <Newspaper className="h-4 w-4 mr-1" />
                      {selectedNewsItem.source}
                    </span>
                    {selectedNewsItem.author && (
                      <span>By {selectedNewsItem.author}</span>
                    )}
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(selectedNewsItem.published_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedNewsItem.read_time}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeNewsModal}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-sm font-medium text-blue-800 mb-2">Article Summary</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {selectedNewsItem.summary}
                </p>
              </div>

              {/* Full Content */}
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                  {selectedNewsItem.full_content}
                </div>
              </div>

              {/* Tags */}
              {selectedNewsItem.tags && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNewsItem.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <p>Published by {selectedNewsItem.source}</p>
                  {selectedNewsItem.author && (
                    <p>Written by {selectedNewsItem.author}</p>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={closeNewsModal}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
                    onClick={() => {
                      // Simulate sharing functionality
                      navigator.clipboard.writeText(`${selectedNewsItem.title} - ${window.location.origin}`);
                      toast.success('Article link copied to clipboard!');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Share Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;