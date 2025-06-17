import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  gradient = false,
  glass = false,
  hover = true,
  className = '',
  ...props 
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200';
  
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border border-gray-200 shadow-md',
    outlined: 'bg-white border-2 border-gray-200',
    filled: 'bg-gray-50 border border-gray-100'
  };

  const gradientClasses = gradient ? 'gradient-border' : '';
  const glassClasses = glass ? 'glass-effect' : '';
  
  const hoverAnimation = hover ? {
    y: -2,
    scale: 1.02,
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
  } : {};

  const cardContent = (
    <div className={gradient ? 'gradient-border-content p-6' : ''}>
      {children}
    </div>
  );

  return (
    <motion.div
      whileHover={hoverAnimation}
      className={`
        ${baseClasses} 
        ${gradient ? gradientClasses : variants[variant]}
        ${glassClasses}
        ${className}
      `}
      {...props}
    >
      {gradient ? cardContent : <div className="p-6">{children}</div>}
    </motion.div>
  );
};

export default Card;