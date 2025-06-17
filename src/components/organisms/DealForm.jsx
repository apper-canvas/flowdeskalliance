import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { dealService } from '@/services';

const DealForm = ({ deal, contacts = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    value: deal?.value || '',
    stage: deal?.stage || 'Lead',
    contactId: deal?.contactId || '',
    probability: deal?.probability || 50,
    expectedCloseDate: deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
    notes: deal?.notes || ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const stages = [
    { value: 'Lead', label: 'Lead' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Closed', label: 'Closed' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Please select a contact';
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        contactId: parseInt(formData.contactId, 10),
        probability: parseInt(formData.probability, 10),
        expectedCloseDate: new Date(formData.expectedCloseDate).toISOString()
      };

      let result;
      if (deal) {
        result = await dealService.update(deal.Id, dealData);
        toast.success('Deal updated successfully');
      } else {
        result = await dealService.create(dealData);
        toast.success('Deal created successfully');
      }

      onSubmit(result);
    } catch (error) {
      toast.error(error.message || 'Failed to save deal');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Deal Title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          error={errors.title}
          required
          icon="Target"
          placeholder="Enter deal title"
        />

        <FormField
          label="Deal Value"
          type="number"
          value={formData.value}
          onChange={(e) => handleChange('value', e.target.value)}
          error={errors.value}
          required
          icon="DollarSign"
          placeholder="Enter deal value"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Contact <span className="text-error">*</span>
          </label>
          <select
            value={formData.contactId}
            onChange={(e) => handleChange('contactId', e.target.value)}
            className={`
              w-full px-4 py-3 border rounded-lg transition-all duration-200
              ${errors.contactId 
                ? 'border-error focus:border-error focus:ring-error/20' 
                : 'border-gray-300 focus:border-primary focus:ring-primary/20 focus:ring-4'
              }
              focus:outline-none bg-white
            `}
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </select>
          {errors.contactId && (
            <p className="text-sm text-error flex items-center mt-1">
              <span className="w-4 h-4 mr-1">⚠</span>
              {errors.contactId}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Stage</label>
          <select
            value={formData.stage}
            onChange={(e) => handleChange('stage', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          >
            {stages.map(stage => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Probability ({formData.probability}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => handleChange('probability', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <FormField
          label="Expected Close Date"
          type="date"
          value={formData.expectedCloseDate}
          onChange={(e) => handleChange('expectedCloseDate', e.target.value)}
          error={errors.expectedCloseDate}
          required
          icon="Calendar"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          placeholder="Add any additional notes about this deal..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon="Save"
        >
          {deal ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </motion.form>
  );
};

export default DealForm;