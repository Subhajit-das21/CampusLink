import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const animations = {
    initial: { opacity: 0, y: 20, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: -20, filter: "blur(10px)" },
};

export default function PageTransition({ children }: Props) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={animations}
            transition={{duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}