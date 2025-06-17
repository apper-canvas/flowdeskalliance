import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const DealCard = ({ 
  deal, 
  contact, 
  onEdit, 
  onDelete, 
  isDragging = false,
  dragHandleProps = {},
  ...props 
}) => {
  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'bg-gradient-to-br from-gray-400 to-gray-500',
      'Qualified': 'bg-gradient-to-br from-blue-400 to-blue-500',
      'Proposal': 'bg-gradient-to-br from-yellow-400 to-yellow-500',
      'Negotiation': 'bg-gradient-to-br from-orange-400 to-orange-500',
      'Closed': 'bg-gradient-to-br from-green-400 to-green-500'
    };
    return colors[stage] || colors['Lead'];
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-yellow-600';
    if (probability >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3
        ${isDragging ? 'shadow-lg ring-2 ring-primary/50 transform rotate-2' : ''}
        hover:shadow-md transition-shadow cursor-pointer group
      `}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
            {deal.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {contact?.name} • {contact?.company}
          </p>
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <div
            {...dragHandleProps}
            className="p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
          >
            <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              icon="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(deal);
              }}
              className="p-1 h-6 w-6"
            />
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deal);
              }}
              className="p-1 h-6 w-6 text-error hover:text-error hover:bg-error/5"
            />
          </div>
        </div>
      </div>

      {/* Value and Probability */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          {formatCurrency(deal.value)}
        </div>
        <div className={`text-sm font-medium ${getProbabilityColor(deal.probability)}`}>
          {deal.probability}%
        </div>
      </div>

      {/* Stage Badge */}
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStageColor(deal.stage)}`}>
          {deal.stage}
        </div>
        <div className="text-xs text-gray-500">
          {format(new Date(deal.expectedCloseDate), 'MMM d')}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${deal.probability}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-2 rounded-full ${getStageColor(deal.stage)}`}
        />
      </div>

      {/* Notes Preview */}
      {deal.notes && (
        <div className="text-xs text-gray-500 line-clamp-2">
          {deal.notes}
        </div>
      )}
    </motion.div>
  );
};

export default DealCard;