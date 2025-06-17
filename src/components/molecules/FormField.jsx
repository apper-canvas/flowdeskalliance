import Input from '@/components/atoms/Input';

const FormField = ({ 
  label, 
  error, 
  helperText,
  children,
  className = '',
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {children || <Input label={label} error={error} {...props} />}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;