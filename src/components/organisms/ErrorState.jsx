import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  title = 'Oops!',
  icon = 'AlertCircle',
  className = '' 
}) => {
  const errorAnimation = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3 }
  };

  const iconBounce = {
    animate: { 
      y: [0, -10, 0],
      transition: { 
        repeat: Infinity, 
        duration: 2,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      {...errorAnimation}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div {...iconBounce}>
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-error mb-4" 
        />
      </motion.div>
      
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
          className="shadow-lg hover:shadow-xl"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;