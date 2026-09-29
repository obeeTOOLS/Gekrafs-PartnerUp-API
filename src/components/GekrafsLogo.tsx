import React from 'react';

interface GekrafsLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const GekrafsLogo: React.FC<GekrafsLogoProps> = ({ 
  className = "w-10 h-10", 
  size,
  showText = false
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={`flex items-center gap-2.5 ${className}`} style={style}>
      <img 
        src="/logo.svg" 
        alt="Logo Resmi Gekrafs Kota Batu" 
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        referrerPolicy="no-referrer"
        loading="eager"
      />
      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-sm font-extrabold tracking-tight text-white leading-tight">
            Gekrafs PartnerUp
          </span>
          <span className="text-[10px] font-bold text-[#ffc72c] uppercase tracking-wider">
            Kota Batu
          </span>
        </div>
      )}
    </div>
  );
};
