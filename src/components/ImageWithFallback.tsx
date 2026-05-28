import React, { useState } from 'react';
import { Car as CarIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  fallbackAlt?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackAlt,
  className = '',
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div 
        className={`w-full h-full bg-[#121214] flex flex-col items-center justify-center border border-white/5 p-4 select-none gap-2 ${className}`}
        style={{ minHeight: '120px' }}
      >
        <CarIcon className="w-8 h-8 text-racing-red/60 animate-pulse" />
        <span className="font-display font-black text-sm tracking-tighter text-white uppercase">
          APEX <span className="text-racing-red italic">AUTO GALLERY</span>
        </span>
        {fallbackAlt && (
          <span className="text-[10px] text-text-grey font-sans text-center px-2 line-clamp-1">
            {fallbackAlt}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      className={className}
      alt={alt || fallbackAlt || "APEX Auto Gallery"}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
