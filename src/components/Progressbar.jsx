import { motion } from "motion/react";

const ProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex justify-between mb-2">
        {stepTitles.map((title, index) => (
          <motion.span
            key={index}
            className={`text-sm font-medium ${
              index <= currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
            animate={{
              color: index <= currentStep ? '#2563eb' : '#9ca3af'
            }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.span>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default ProgressBar;