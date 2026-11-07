import { motion } from "framer-motion";
import logoEmblem from "@/assets/logo-emblem.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14", 
  lg: "w-18 h-18",
  xl: "w-24 h-24"
};

export const Logo = ({ 
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
    <div className={`flex items-center gap-3.5 ${className}`}>
      <LogoImage
        className={`${sizeClasses[size]} rounded-2xl bg-black dark:bg-transparent p-1.5 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm dark:shadow-none relative group cursor-pointer`}
        {...imageProps}
      >
        <img 
          src={logoEmblem} 
          alt="Beka Bayecha Logo" 
          className="w-full h-full object-contain"
        />
      </LogoImage>
      
      {showText && (
        <div className="flex flex-col">
          <LogoText 
            className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-wider uppercase leading-tight"
            {...textProps}
          >
            Beka Bayecha
          </LogoText>
          {showSubtitle && (
            <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest">
              Full Stack Developer
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
