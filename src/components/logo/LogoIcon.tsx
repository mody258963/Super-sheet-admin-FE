// next
import Image from 'next/image';

// ==============================|| LOGO ICON IMAGE ||============================== //

export default function LogoIcon() {
  return (
    <Image 
      src="/assets/images/logo.png" 
      alt="DEIT Logo Icon" 
      width={40} 
      height={40} 
      priority
      style={{ 
        objectFit: 'contain',
        maxHeight: '30px'
      }}
    />
  );
}
