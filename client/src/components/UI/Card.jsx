import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  onClick,
  glass = false
}) => {
  const baseStyles = 'bg-white rounded-xl p-6 transition-all duration-300';
  const glassStyles = glass ? 'glass shadow-lg' : 'shadow-custom-soft';
  const hoverStyles = hover ? 'hover:shadow-custom-medium hover:-translate-y-1' : '';
  
  return (
    <motion.div
      className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...(onClick && { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } })}
    >
      {children}
    </motion.div>
  );
};

export default Card;
