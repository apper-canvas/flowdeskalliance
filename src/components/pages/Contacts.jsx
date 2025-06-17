import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Modal from '@/components/molecules/Modal';
import ContactForm from '@/components/organisms/ContactForm';
import ContactTable from '@/components/organisms/ContactTable';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import { contactService } from '@/services';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await contactService.getAll();
      setContacts(result);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

const filtered = contacts.filter(contact => {
      const tags = contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()) : [];
      return (
        contact.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    setFilteredContacts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [...prev, newContact]);
      setShowCreateModal(false);
      toast.success('Contact created successfully');
    } catch (error) {
      toast.error('Failed to create contact');
    }
  };

  const handleEditContact = async (contactData) => {
    try {
      const updatedContact = await contactService.update(selectedContact.Id, contactData);
      setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? updatedContact : c));
      setShowEditModal(false);
      setSelectedContact(null);
      toast.success('Contact updated successfully');
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;

    try {
      await contactService.delete(contactToDelete.Id);
      setContacts(prev => prev.filter(c => c.Id !== contactToDelete.Id));
      setShowDeleteModal(false);
      setContactToDelete(null);
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setShowEditModal(true);
  };

  const handleDelete = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const handleView = (contact) => {
    setSelectedContact(contact);
    // Could expand to show contact details modal
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
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
          <div className="h-10 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <SkeletonLoader count={5} type="table" />
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
          onRetry={loadContacts}
          title="Failed to load contacts"
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
            Contacts
          </h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            icon="Plus"
            size="md"
          >
            Add Contact
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <SearchBar
            placeholder="Search contacts..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
      </div>

      {/* Content */}
      {filteredContacts.length === 0 && !searchQuery ? (
        <EmptyState
          title="No contacts yet"
          description="Start building your network by adding your first contact"
          actionLabel="Add Contact"
          onAction={() => setShowCreateModal(true)}
          icon="Users"
        />
      ) : filteredContacts.length === 0 && searchQuery ? (
        <EmptyState
          title="No contacts found"
          description={`No contacts match "${searchQuery}". Try adjusting your search terms.`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
          icon="Search"
        />
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

      {/* Create Contact Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Contact"
        size="lg"
      >
        <ContactForm
          onSubmit={handleCreateContact}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Contact Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedContact(null);
        }}
        title="Edit Contact"
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSubmit={handleEditContact}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedContact(null);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setContactToDelete(null);
        }}
        title="Delete Contact"
        size="sm"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Trash2" className="w-6 h-6 text-error" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Contact
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{contactToDelete?.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setContactToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteContact}
              icon="Trash2"
            >
              Delete Contact
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Contacts;