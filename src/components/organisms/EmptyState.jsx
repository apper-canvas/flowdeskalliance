import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = 'No items found',
  description = 'Get started by creating your first item',
  actionLabel = 'Create Item',
  onAction,
  icon = 'Package',
  className = '' 
}) => {
  const emptyAnimation = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3 }
  };

  const iconFloat = {
    animate: { 
      y: [0, -10, 0],
      transition: { 
        repeat: Infinity, 
        duration: 3,
        ease: 'easeInOut'
      }
    }
  };

  const buttonHover = {
    scale: 1.05,
    y: -2
  };

  const buttonTap = {
    scale: 0.95
  };

  return (
    <motion.div
      {...emptyAnimation}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div {...iconFloat}>
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
          <ApperIcon 
            name={icon} 
            className="w-10 h-10 text-primary" 
          />
        </div>
      </motion.div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <motion.div
          whileHover={buttonHover}
          whileTap={buttonTap}
        >
          <Button
            onClick={onAction}
            variant="primary"
            icon="Plus"
            size="lg"
            className="shadow-lg hover:shadow-xl"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;