import React from 'react';
import PropTypes from 'prop-types';

export function Button({ children, onClick, className = '', variant = 'default', ...props }) {
  const baseStyle =
    'px-4 py-2 rounded-xl font-medium focus:outline-none transition-all duration-200';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-white text-white hover:bg-white hover:text-black',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  const styles = `${baseStyle} ${variants[variant]} ${className}`;

  return (
    <button onClick={onClick} className={styles} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost']),
};
