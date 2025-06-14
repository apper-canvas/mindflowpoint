import { motion } from 'framer-motion';

const SkeletonLoader = ({ 
  count = 1, 
  variant = 'card',
  className = ''
}) => {
  const shimmer = {
    animate: {
      x: [-100, 100],
    },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  };

  const cardSkeleton = (
    <div className="bg-white rounded-lg p-6 shadow-soft">
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );

  const listSkeleton = (
    <div className="bg-white rounded-lg p-4 shadow-soft">
      <div className="animate-pulse flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  const textSkeleton = (
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  );

  const getSkeletonContent = () => {
    switch (variant) {
      case 'card':
        return cardSkeleton;
      case 'list':
        return listSkeleton;
      case 'text':
        return textSkeleton;
      default:
        return cardSkeleton;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {getSkeletonContent()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;