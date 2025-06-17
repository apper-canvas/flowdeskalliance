import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/atoms/Card';
import SearchBar from '@/components/molecules/SearchBar';
import Modal from '@/components/molecules/Modal';
import DealForm from '@/components/organisms/DealForm';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { dealService, contactService } from '@/services';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [filterStage, setFilterStage] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const stages = [
    { value: 'all', label: 'All Stages' },
    { value: 'Lead', label: 'Lead' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed', label: 'Closed' }
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'value', label: 'Deal Value' },
    { value: 'title', label: 'Deal Title' },
    { value: 'expectedCloseDate', label: 'Close Date' },
    { value: 'probability', label: 'Probability' }
  ];

  useEffect(() => {
    Promise.all([loadDeals(), loadContacts()]);
  }, []);

  useEffect(() => {
    filterAndSortDeals();
  }, [deals, searchQuery, filterStage, sortBy, sortOrder]);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dealService.getAll();
      setDeals(result);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const result = await contactService.getAll();
      setContacts(result);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  const filterAndSortDeals = () => {
    let filtered = [...deals];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getContactForDeal(deal.contactId)?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getContactForDeal(deal.contactId)?.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by stage
    if (filterStage !== 'all') {
      filtered = filtered.filter(deal => deal.stage === filterStage);
    }

    // Sort deals
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'expectedCloseDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredDeals(filtered);
  };

  const getContactForDeal = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'default',
      'Qualified': 'info',
      'Proposal': 'warning',
      'Negotiation': 'secondary',
      'Closed': 'success'
    };
    return colors[stage] || 'default';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateDeal = async (dealData) => {
    try {
      const newDeal = await dealService.create(dealData);
      setDeals(prev => [...prev, newDeal]);
      setShowCreateModal(false);
      toast.success('Deal created successfully');
    } catch (error) {
      toast.error('Failed to create deal');
    }
  };

  const handleEditDeal = async (dealData) => {
    try {
      const updatedDeal = await dealService.update(selectedDeal.Id, dealData);
      setDeals(prev => prev.map(d => d.Id === selectedDeal.Id ? updatedDeal : d));
      setShowEditModal(false);
      setSelectedDeal(null);
      toast.success('Deal updated successfully');
    } catch (error) {
      toast.error('Failed to update deal');
    }
  };

  const handleDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      await dealService.delete(dealToDelete.Id);
      setDeals(prev => prev.filter(d => d.Id !== dealToDelete.Id));
      setShowDeleteModal(false);
      setDealToDelete(null);
      toast.success('Deal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete deal');
    }
  };

  const handleEdit = (deal) => {
    setSelectedDeal(deal);
    setShowEditModal(true);
  };

  const handleDelete = (deal) => {
    setDealToDelete(deal);
    setShowDeleteModal(true);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="p-6 max-w-full overflow-hidden"
      >
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="flex space-x-4 mb-4">
            <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <SkeletonLoader count={6} type="card" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="p-6 max-w-full overflow-hidden"
      >
        <ErrorState
          message={error}
          onRetry={loadDeals}
          title="Failed to load deals"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="p-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Deals
          </h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            icon="Plus"
            size="md"
          >
            Add Deal
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search deals..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              {stages.map(stage => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
            >
              {sortOptions.map(option => (
                <optgroup key={option.value} label={option.label}>
                  <option value={`${option.value}-asc`}>↑ {option.label}</option>
                  <option value={`${option.value}-desc`}>↓ {option.label}</option>
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredDeals.length === 0 && !searchQuery && filterStage === 'all' ? (
        <EmptyState
          title="No deals yet"
          description="Start tracking your sales opportunities by creating your first deal"
          actionLabel="Add Deal"
          onAction={() => setShowCreateModal(true)}
          icon="Target"
        />
      ) : filteredDeals.length === 0 ? (
        <EmptyState
          title="No deals found"
          description="No deals match your current filters. Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setFilterStage('all');
          }}
          icon="Search"
        />
      ) : (
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDeals.map((deal) => {
            const contact = getContactForDeal(deal.contactId);
            return (
              <motion.div key={deal.Id} variants={cardVariants}>
                <Card hover className="h-full">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {deal.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {contact?.name} • {contact?.company}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => handleEdit(deal)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDelete(deal)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error hover:bg-error/5"
                        />
                      </div>
                    </div>

                    {/* Value and Probability */}
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-semibold text-gray-900">
                        {formatCurrency(deal.value)}
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        {deal.probability}% probability
                      </div>
                    </div>

                    {/* Stage and Date */}
                    <div className="flex items-center justify-between">
                      <Badge variant={getStageColor(deal.stage)}>
                        {deal.stage}
                      </Badge>
                      <div className="text-sm text-gray-500">
                        {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${deal.probability}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>

                    {/* Notes */}
                    {deal.notes && (
                      <div className="text-sm text-gray-600 line-clamp-2">
                        {deal.notes}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Create Deal Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Deal"
        size="lg"
      >
        <DealForm
          contacts={contacts}
          onSubmit={handleCreateDeal}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Deal Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDeal(null);
        }}
        title="Edit Deal"
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          contacts={contacts}
          onSubmit={handleEditDeal}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedDeal(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDealToDelete(null);
        }}
        title="Delete Deal"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Trash2" className="w-6 h-6 text-error" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Deal
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{dealToDelete?.title}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDealToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteDeal}
              icon="Trash2"
            >
              Delete Deal
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Deals;