import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  Plus, 
  Building, 
  Phone, 
  Mail,
  User,
  MapPin,
  Calendar,
  DollarSign,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const CRM = () => {
  const [threePLs, setThreePLs] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [newDeal, setNewDeal] = useState({
    threepl_id: '',
    deal_name: '',
    stage: 'New',
    value: '',
    expected_close_date: '',
    notes: '',
    rep_owner: ''
  });

  const dealStages = ['New', 'Discovery', 'Proposal', 'In Negotiation', 'Won', 'Lost'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [threePLsRes, dealsRes] = await Promise.all([
        axios.get('/api/3pls'),
        axios.get('/api/deals')
      ]);
      setThreePLs(threePLsRes.data);
      setDeals(dealsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const dealId = draggableId;
    const newStage = destination.droppableId;

    // Update deal stage locally
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );

    // Update deal stage on backend
    try {
      const dealToUpdate = deals.find(deal => deal.id === dealId);
      await axios.put(`/api/deals/${dealId}`, {
        ...dealToUpdate,
        stage: newStage
      });
      toast.success('Deal stage updated!');
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal stage');
      // Revert on error
      fetchData();
    }
  };

  const getThreePLName = (threeplId) => {
    const threepl = threePLs.find(tpl => tpl.id === threeplId);
    return threepl ? threepl.company_name : 'Unknown Company';
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const dealData = {
        ...newDeal,
        value: parseFloat(newDeal.value) || 0,
        expected_close_date: newDeal.expected_close_date ? new Date(newDeal.expected_close_date) : null
      };

      await axios.post('/api/deals', dealData);
      toast.success('Deal created successfully!');
      setShowDealModal(false);
      setNewDeal({
        threepl_id: '',
        deal_name: '',
        stage: 'New',
        value: '',
        expected_close_date: '',
        notes: '',
        rep_owner: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Failed to create deal');
    }
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'New': return 'bg-blue-100 border-blue-300';
      case 'Discovery': return 'bg-yellow-100 border-yellow-300';
      case 'Proposal': return 'bg-purple-100 border-purple-300';
      case 'In Negotiation': return 'bg-orange-100 border-orange-300';
      case 'Won': return 'bg-green-100 border-green-300';
      case 'Lost': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getDealCardColor = (stage) => {
    switch (stage) {
      case 'Won': return 'border-l-green-500';
      case 'Lost': return 'border-l-red-500';
      case 'In Negotiation': return 'border-l-orange-500';
      default: return 'border-l-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-8 w-64 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 h-96 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM - Deal Pipeline</h1>
          <p className="text-gray-600 mt-2">
            Manage your 3PL relationships and track deals through the sales pipeline
          </p>
        </div>
        <button
          onClick={() => setShowDealModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Deal
        </button>
      </div>

      {/* Deal Pipeline */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="kanban-board">
          {dealStages.map((stage) => {
            const stageDeals = deals.filter(deal => deal.stage === stage);
            
            return (
              <div key={stage} className={`kanban-column ${getStageColor(stage)} border-2 border-dashed`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{stage}</h3>
                  <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
                    {stageDeals.length}
                  </span>
                </div>

                <Droppable droppableId={stage}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px]"
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`kanban-card border-l-4 ${getDealCardColor(deal.stage)}`}
                            >
                              <div className="mb-2">
                                <h4 className="font-medium text-gray-900 text-sm mb-1">
                                  {deal.deal_name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {getThreePLName(deal.threepl_id)}
                                </p>
                              </div>

                              {deal.value && (
                                <div className="flex items-center text-xs text-gray-600 mb-1">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  ${deal.value?.toLocaleString()}
                                </div>
                              )}

                              {deal.expected_close_date && (
                                <div className="flex items-center text-xs text-gray-600 mb-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(deal.expected_close_date).toLocaleDateString()}
                                </div>
                              )}

                              {deal.rep_owner && (
                                <div className="flex items-center text-xs text-gray-600">
                                  <User className="h-3 w-3 mr-1" />
                                  {deal.rep_owner}
                                </div>
                              )}

                              {deal.notes && (
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                  {deal.notes}
                                </p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* 3PL Partners Summary */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">3PL Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {threePLs.map((threepl) => (
            <div key={threepl.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Building className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="font-semibold text-gray-900">{threepl.company_name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{threepl.primary_contact}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  threepl.status === 'New' ? 'bg-blue-100 text-blue-800' :
                  threepl.status === 'Engaged' ? 'bg-yellow-100 text-yellow-800' :
                  threepl.status === 'Matched' ? 'bg-green-100 text-green-800' :
                  threepl.status === 'Dormant' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {threepl.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-3 w-3 mr-2" />
                  {threepl.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-3 w-3 mr-2" />
                  {threepl.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-3 w-3 mr-2" />
                  {threepl.regions_covered?.join(', ')}
                </div>
              </div>

              {threepl.services && threepl.services.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {threepl.services.map((service, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <p><strong>Rep Owner:</strong> {threepl.rep_owner || 'Unassigned'}</p>
                <p><strong>Locations:</strong> {threepl.number_of_locations || 0}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Deal Modal */}
      {showDealModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Deal</h3>
              <button
                onClick={() => setShowDealModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  3PL Partner *
                </label>
                <select
                  value={newDeal.threepl_id}
                  onChange={(e) => setNewDeal({...newDeal, threepl_id: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Select a 3PL Partner</option>
                  {threePLs.map(threepl => (
                    <option key={threepl.id} value={threepl.id}>
                      {threepl.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Name *
                </label>
                <input
                  type="text"
                  value={newDeal.deal_name}
                  onChange={(e) => setNewDeal({...newDeal, deal_name: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stage
                  </label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({...newDeal, stage: e.target.value})}
                    className="input-field"
                  >
                    {dealStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value ($)
                  </label>
                  <input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({...newDeal, value: e.target.value})}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={newDeal.expected_close_date}
                    onChange={(e) => setNewDeal({...newDeal, expected_close_date: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rep Owner
                  </label>
                  <input
                    type="text"
                    value={newDeal.rep_owner}
                    onChange={(e) => setNewDeal({...newDeal, rep_owner: e.target.value})}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({...newDeal, notes: e.target.value})}
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDealModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;