import { useState } from "react";

interface AvatarImageProps {
  src: string;
  alt: string;
  fallbackJamo?: string;
  sizeClass?: string;
  className?: string;
}

export function AvatarImage({
  src,
  alt,
  fallbackJamo = "ㅎ",
  sizeClass = "w-11 h-11",
  className = "",
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${sizeClass} rounded-[38%] bg-[#FFF4C2] text-[#3C1E1E] border border-[#E6D89C] flex items-center justify-center font-display font-bold select-none shrink-0 ${className}`}
      >
        <span>{fallbackJamo}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${sizeClass} rounded-[38%] object-cover bg-[#EFE9DA] border border-black/10 shrink-0 ${className}`}
    />
  );
}
