import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

/**
 * PageTransition Component: The Kinetic Interface Bridge
 * Standardizes entry and exit animations for all application nodes.
 */
const animations = {
    initial: { 
        opacity: 0, 
        y: 20, 
        filter: "blur(10px)" 
    },
    animate: { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)" 
    },
    exit: { 
        opacity: 0, 
        y: -20, 
        filter: "blur(10px)" 
    },
};

export default function PageTransition({ children }: Props) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animations}
            // Transition timing optimized for 2026 CampusLink motion standards
            transition={{
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1] 
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}