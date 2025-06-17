import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 border';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white border-transparent hover:shadow-lg hover:shadow-primary/25 focus:ring-primary/50',
    secondary: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
    outline: 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
    danger: 'bg-error text-white border-transparent hover:bg-red-600 focus:ring-error/50',
    success: 'bg-success text-white border-transparent hover:bg-green-600 focus:ring-success/50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const hoverAnimation = {
    scale: disabled || loading ? 1 : 1.05,
    y: disabled || loading ? 0 : -1
  };

  const tapAnimation = {
    scale: disabled || loading ? 1 : 0.95,
    y: disabled || loading ? 0 : 0
  };

  return (
    <motion.button
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <ApperIcon name="Loader2" className={`${iconSizes[size]} mr-2`} />
          </motion.div>
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} className={`${iconSizes[size]} ${children ? 'mr-2' : ''}`} />
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} className={`${iconSizes[size]} ${children ? 'ml-2' : ''}`} />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;