import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  selected = false,
  hover = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4',
        'transition-all duration-300',
        hover && 'hover:bg-white/15 hover:border-white/30',
        selected && 'ring-2 ring-cyan-500 bg-cyan-500/10 border-cyan-500/30',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;