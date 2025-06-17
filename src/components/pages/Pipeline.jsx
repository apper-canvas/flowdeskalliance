import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';
import DealForm from '@/components/organisms/DealForm';
import PipelineBoard from '@/components/organisms/PipelineBoard';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { dealService, contactService } from '@/services';

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  useEffect(() => {
    Promise.all([loadData()]);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsResult, contactsResult] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsResult);
      setContacts(contactsResult);
    } catch (err) {
      setError(err.message || 'Failed to load pipeline data');
      toast.error('Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePipelineStats = () => {
    const stats = {
      totalValue: 0,
      totalDeals: deals.length,
      averageValue: 0,
      conversionRate: 0
    };

    if (deals.length > 0) {
      stats.totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
      stats.averageValue = stats.totalValue / deals.length;
      
      const closedDeals = deals.filter(deal => deal.stage === 'Closed');
      stats.conversionRate = (closedDeals.length / deals.length) * 100;
    }

    return stats;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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

  const stats = calculatePipelineStats();

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <SkeletonLoader count={3} type="pipeline" />
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
          onRetry={loadData}
          title="Failed to load pipeline"
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
            Sales Pipeline
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pipeline</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-primary" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDeals}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-info/10 to-info/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Target" className="w-6 h-6 text-info" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Deal</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageValue)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-warning/10 to-warning/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-warning" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-success/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" className="w-6 h-6 text-success" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <EmptyState
          title="No deals in pipeline"
          description="Start building your sales pipeline by adding your first deal"
          actionLabel="Add Deal"
          onAction={() => setShowCreateModal(true)}
          icon="Target"
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <PipelineBoard
            deals={deals}
            contacts={contacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={loadData}
          />
        </div>
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

export default Pipeline;