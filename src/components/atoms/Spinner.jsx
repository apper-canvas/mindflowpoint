import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Spinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  const colors = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`inline-block ${colors[color]} ${className}`}
    >
      <ApperIcon name="Loader2" size={sizes[size]} />
    </motion.div>
  );
};

export default Spinner;