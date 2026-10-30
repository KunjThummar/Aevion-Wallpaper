import React from 'react';
import { Link } from 'react-router-dom';

export const Logo = ({ size = 'md', className = '' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Geometric origami hummingbird logo */}
      <div className="relative flex items-center justify-center rounded-lg p-0.5 transition-transform duration-200 group-hover:scale-105">
        <img
          src="/logo.png"
          alt="Aevion Logo"
          className={`object-contain ${
            isSm ? 'w-6 h-6' : isLg ? 'w-10 h-10' : 'w-8 h-8'
          }`}
        />
      </div>

      <div className="flex flex-col">
        <span className={`font-display font-black tracking-tight text-slate-900 dark:text-white leading-none ${
          isSm ? 'text-lg' : isLg ? 'text-2xl' : 'text-xl'
        }`}>
          Aevion
        </span>
      </div>
    </Link>
  );
};
