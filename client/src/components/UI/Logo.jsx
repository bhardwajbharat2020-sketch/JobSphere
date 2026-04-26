import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'default', showTagline = true, variant = 'light', className = '' }) => {
  const sizes = {
    small: { width: 180, height: 48 },  // Increased from 140x40 to 180x48
    default: { width: 220, height: 66 }, // Increased from 200x60 to 220x66
    large: { width: 300, height: 90 },   // Increased from 280x80 to 300x90
  };

  const { width, height } = sizes[size];
  
  // Color variants
  const colors = {
    light: {
      globe: '#2563EB',
      briefcase: '#2563EB',
      textPrimary: '#0F172A',
      textAccent: '#2563EB',
      tagline: '#64748B',
    },
    dark: {
      globe: '#60A5FA',
      briefcase: '#60A5FA',
      textPrimary: '#FFFFFF',
      textAccent: '#60A5FA',
      tagline: '#94A3B8',
    },
  };
  
  const theme = colors[variant];

  return (
    <Link to="/" className={`inline-block ${className}`}>
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 320 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer"
      >
        {/* Globe */}
        <circle cx="40" cy="40" r="30" stroke={theme.globe} strokeWidth="3" />
        <path d="M10 40H70" stroke={theme.globe} strokeWidth="2" />
        <path d="M40 10C25 25 25 55 40 70" stroke={theme.globe} strokeWidth="2" />
        <path d="M40 10C55 25 55 55 40 70" stroke={theme.globe} strokeWidth="2" />

        {/* Briefcase */}
        <rect x="28" y="34" width="24" height="16" rx="3" fill={theme.briefcase} />
        <rect x="34" y="28" width="12" height="6" rx="2" fill={theme.briefcase} />

        {/* Text */}
        <text
          x="85"
          y="45"
          fontFamily="Poppins, sans-serif"
          fontSize="28"
          fill={theme.textPrimary}
          fontWeight="600"
        >
          Job<tspan fill={theme.textAccent}>Sphere</tspan>
        </text>

        {/* Tagline */}
        {showTagline && (
          <text
            x="85"
            y="65"
            fontFamily="Poppins, sans-serif"
            fontSize="12"
            fill={theme.tagline}
          >
            Connect. Apply. Grow.
          </text>
        )}
      </motion.svg>
    </Link>
  );
};

export default Logo;
