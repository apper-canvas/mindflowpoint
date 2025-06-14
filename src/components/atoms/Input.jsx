import { motion } from 'framer-motion';
import { useState } from 'react';
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
  const shouldShowLabel = focused || hasValue;

  const inputClass = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 
    focus:outline-none focus:ring-0 bg-white
    ${error 
      ? 'border-error focus:border-error' 
      : focused 
        ? 'border-primary focus:border-primary shadow-lg shadow-primary/20' 
        : 'border-gray-200 focus:border-primary hover:border-gray-300'
    }
    ${icon ? 'pl-12' : ''}
    ${type === 'password' ? 'pr-12' : ''}
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className="relative">
      {/* Floating Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            y: shouldShowLabel ? -28 : 0,
            scale: shouldShowLabel ? 0.875 : 1,
            color: error ? '#E07A5F' : focused ? '#6B5B95' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 top-3 pointer-events-none font-medium origin-left"
        >
          {label} {required && <span className="text-error">*</span>}
        </motion.label>
      )}

      {/* Icon */}
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <ApperIcon name={icon} size={18} />
        </div>
      )}

      {/* Input */}
      <input
        type={type === 'password' && showPassword ? 'text' : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ''}
        disabled={disabled}
        className={inputClass}
        {...props}
      />

      {/* Password Toggle */}
      {type === 'password' && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
        </button>
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;