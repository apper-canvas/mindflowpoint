import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-100 overflow-hidden';
  
  const variants = {
    default: 'shadow-soft',
    elevated: 'shadow-card',
    floating: 'shadow-floating',
    outlined: 'border-2 border-gray-200 shadow-none',
    gradient: 'bg-gradient-to-br from-surface to-white shadow-soft'
  };

  const hoverClasses = hover && onClick ? 'cursor-pointer' : '';
  
  const cardClass = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;

  const cardContent = (
    <div className="w-full h-full max-w-full overflow-hidden">
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileHover={hover ? { y: -2, scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
        className={cardClass}
        onClick={onClick}
        {...props}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <div className={cardClass} {...props}>
      {cardContent}
    </div>
  );
};

export default Card;