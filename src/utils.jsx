export const animations = {
    container: {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: -50,
            transition: { duration: 0.3 }
        }
    },
    item: {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4 }
        }
    },
    button: {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    },
    progress: {
        initial: { width: 0 },
        animate: (progress) => ({
            width: `${progress}%`,
            transition: { duration: 0.6, ease: "easeInOut" }
        })
    }
};