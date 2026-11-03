import { motion } from "framer-motion";
import bekiImage from "@/assets/beki.jpg";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10", 
  lg: "w-12 h-12",
  xl: "w-20 h-20"
};

const Logo = ({ 
  size = "md", 
  showText = true, 
  showSubtitle = false,
  className = "", 
  animated = false 
}: LogoProps) => {
  const LogoImage = animated ? motion.div : "div";
  const LogoText = animated ? motion.span : "span";

  const imageProps = animated ? {
    whileHover: { scale: 1.05 },
    transition: { type: "spring" as const, stiffness: 300, damping: 20 }
  } : {};

  const textProps = animated ? {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.2 }
  } : {};

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoImage
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-primary/20 shadow-lg relative group cursor-pointer`}
        {...imageProps}
      >
        {/* Gradient overlay for modern effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        
        {/* Profile image */}
        <img 
          src={bekiImage} 
          alt="Beka Bayecha" 
          className="w-full h-full object-cover object-center"
        />
        
        {/* Subtle ring animation */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        )}
      </LogoImage>
      
      {showText && (
        <div className="flex flex-col">
          <LogoText 
            className="font-heading font-bold text-xl gradient-text"
            {...textProps}
          >
            Beka Bayecha <span className="text-foreground"></span>
          </LogoText>
          {showSubtitle && (
            <span className="text-xs text-muted-foreground">Full Stack Developer</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;