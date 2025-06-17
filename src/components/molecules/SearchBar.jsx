import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  debounceMs = 300,
  className = '',
  ...props 
}) => {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, onSearch, debounceMs]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <motion.div
      animate={{
        scale: focused ? 1.02 : 1,
        boxShadow: focused 
          ? '0 4px 12px rgba(99, 102, 241, 0.15)' 
          : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.2 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200 bg-white
            ${focused ? 'shadow-lg' : 'shadow-sm'}
          `}
          {...props}
        />

        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;