import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const ContactTable = ({ contacts, onEdit, onDelete, onView }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

const sortedContacts = [...contacts].sort((a, b) => {
    let aValue, bValue;
    
    if (sortField === 'name') {
      aValue = a.Name;
      bValue = b.Name;
    } else if (sortField === 'createdAt') {
      aValue = a.CreatedOn;
      bValue = b.CreatedOn;
    } else if (sortField === 'lastContactedAt') {
      aValue = a.last_contacted_at;
      bValue = b.last_contacted_at;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (sortField === 'createdAt' || sortField === 'lastContactedAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortHeader = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <div className="flex flex-col">
          <ApperIcon 
            name="ChevronUp" 
            className={`w-3 h-3 ${
              sortField === field && sortDirection === 'asc' 
                ? 'text-primary' 
                : 'text-gray-300'
            }`} 
          />
          <ApperIcon 
            name="ChevronDown" 
            className={`w-3 h-3 -mt-1 ${
              sortField === field && sortDirection === 'desc' 
                ? 'text-primary' 
                : 'text-gray-300'
            }`} 
          />
        </div>
      </div>
    </th>
  );

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortHeader field="name">Name</SortHeader>
              <SortHeader field="email">Email</SortHeader>
              <SortHeader field="company">Company</SortHeader>
              <SortHeader field="position">Position</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <SortHeader field="lastContactedAt">Last Contact</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <motion.tbody 
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="bg-white divide-y divide-gray-200"
          >
            {sortedContacts.map((contact) => (
              <motion.tr
                key={contact.Id}
                variants={itemVariants}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="transition-colors cursor-pointer"
                onClick={() => onView(contact)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
<div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {contact.Name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {contact.Name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.position}</div>
                </td>
<td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {contact.Tags && contact.Tags.split(',').slice(0, 2).map(tag => (
                      <Badge key={tag.trim()} variant="primary" size="sm">
                        {tag.trim()}
                      </Badge>
                    ))}
                    {contact.Tags && contact.Tags.split(',').length > 2 && (
                      <Badge variant="default" size="sm">
                        +{contact.Tags.split(',').length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {contact.last_contacted_at 
                    ? format(new Date(contact.last_contacted_at), 'MMM d, yyyy')
                    : 'Never'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(contact);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(contact);
                      }}
                      className="text-error hover:text-error hover:bg-error/5"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactTable;