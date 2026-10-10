import React from 'react';

export const Card = ({
  children,
  interactive = false,
  hoverable = false,
  className = '',
  onClick,
  ...props
}) => {
  const Component = interactive || onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        bg-surface border border-border rounded-lg p-4 transition-all duration-150 text-left w-full
        ${hoverable ? 'hover:border-primary/50 hover:shadow-subtle' : ''}
        ${interactive ? 'cursor-pointer hover:border-primary active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
