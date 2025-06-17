import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { contactService } from '@/services';

const ContactForm = ({ contact, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name: contact?.Name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    position: contact?.position || '',
    tags: contact?.Tags ? contact.Tags.split(',').map(tag => tag.trim()).join(', ') : ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
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
      const contactData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      let result;
      if (contact) {
        result = await contactService.update(contact.Id, contactData);
        toast.success('Contact updated successfully');
      } else {
        result = await contactService.create(contactData);
        toast.success('Contact created successfully');
      }

      onSubmit(result);
    } catch (error) {
      toast.error(error.message || 'Failed to save contact');
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
          label="Full Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          icon="User"
          placeholder="Enter full name"
        />

        <FormField
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          icon="Mail"
          placeholder="Enter email address"
        />

        <FormField
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
          icon="Phone"
          placeholder="Enter phone number"
        />

        <FormField
          label="Company"
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          error={errors.company}
          required
          icon="Building"
          placeholder="Enter company name"
        />

        <FormField
          label="Position"
          type="text"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
          error={errors.position}
          icon="Briefcase"
          placeholder="Enter job title"
        />

        <FormField
          label="Tags"
          type="text"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          error={errors.tags}
          icon="Tag"
          placeholder="Enter tags (comma separated)"
          helperText="Separate multiple tags with commas"
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
          {contact ? 'Update Contact' : 'Create Contact'}
        </Button>
      </div>
    </motion.form>
  );
};

export default ContactForm;