import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const EmptyState = ({ 
  icon = 'Package',
  title = 'No items yet',
  description = 'Get started by creating your first item',
  actionLabel = 'Create Item',
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-6"
      >
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
      </motion.div>

      <Text variant="h3" className="mb-3 text-gray-700">
        {title}
      </Text>
      
      <Text color="muted" className="mb-8 max-w-md mx-auto">
        {description}
      </Text>

      {onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onAction} icon="Plus" iconPosition="left">
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;