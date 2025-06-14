const Text = ({ 
  children, 
  variant = 'body',
  size,
  weight = 'normal',
  color = 'default',
  className = '',
  as: Component = 'p',
  ...props 
}) => {
  const variants = {
    display: 'font-display text-4xl lg:text-5xl font-bold',
    h1: 'font-display text-3xl lg:text-4xl font-bold',
    h2: 'font-display text-2xl lg:text-3xl font-semibold',
    h3: 'font-display text-xl lg:text-2xl font-semibold',
    h4: 'font-display text-lg lg:text-xl font-medium',
    h5: 'font-display text-base lg:text-lg font-medium',
    h6: 'font-display text-sm lg:text-base font-medium',
    body: 'text-base',
    caption: 'text-sm',
    small: 'text-xs'
  };

  const weights = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const colors = {
    default: 'text-gray-900',
    muted: 'text-gray-600',
    light: 'text-gray-500',
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    white: 'text-white'
  };

  const sizeClasses = size ? `text-${size}` : '';
  
  const textClass = `
    ${variants[variant]} 
    ${weights[weight]} 
    ${colors[color]} 
    ${sizeClasses} 
    ${className}
  `.trim();

  return (
    <Component className={textClass} {...props}>
      {children}
    </Component>
  );
};

export default Text;