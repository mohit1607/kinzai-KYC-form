import { motion } from "motion/react";

const SuccessMessage = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: -20 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-center text-green-600 text-xl font-medium"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
      className="text-6xl mb-4"
    >
      ✅
    </motion.div>
    Success! Your information has been submitted.
  </motion.div>
);

export default SuccessMessage