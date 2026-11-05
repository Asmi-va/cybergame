import Image from 'next/image';

type Props = {
  size?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
};

/** Official SafeRon mark — shield + check, LEARN · TRUST · VERIFY. */
export default function SaferonLogo({ size = 40, className = '', priority = false, alt = 'SafeRon' }: Props) {
  return (
    <Image
      src="/saferon-logo.png"
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority={priority}
    />
  );
}
