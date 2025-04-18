// next
import Image from 'next/image';

// ==============================|| LOGO IMAGE ||============================== //

export default function LogoMain({ reverse }: { reverse?: boolean }) {
  return (
    <Image 
      src="/assets/images/logo.png" 
      alt="DEIT Logo" 
      width={120} 
      height={36} 
      priority
      style={{ 
        objectFit: 'contain',
        maxHeight: '50px'
      }}
    />
  );
}
