import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloat = focused || hasValue;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <ApperIcon name={icon} className="w-5 h-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200 
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : focused 
                ? 'border-primary focus:border-primary focus:ring-primary/20 focus:ring-4' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}
            focus:outline-none
          `}
          placeholder={!label ? placeholder : ''}
          {...props}
        />

        {label && (
          <motion.label
            animate={{
              top: shouldFloat ? '0.5rem' : '50%',
              fontSize: shouldFloat ? '0.75rem' : '1rem',
              color: error ? '#EF4444' : focused ? '#6366F1' : '#6B7280',
              y: shouldFloat ? 0 : '-50%'
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`
              absolute left-4 pointer-events-none transform origin-left
              ${icon ? 'left-10' : 'left-4'}
              ${shouldFloat ? 'bg-white px-1' : ''}
            `}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mt-1 text-sm text-error"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;