import { motion, AnimatePresence } from "motion/react";
import { animations } from '../utils'

const NavigationButtons = ({
    currentStep,
    onNext,
    onBack,
    canProceed = true,
    isLastStep = false
}) => {
    return (
        <motion.div
            className="flex justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            <AnimatePresence>
                {currentStep > 0 && (
                    <motion.button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 transition-colors duration-200"
                        variants={animations.button}
                        whileHover="hover"
                        whileTap="tap"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        ← Back
                    </motion.button>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={onNext}
                disabled={!canProceed}
                className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${!canProceed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                variants={animations.button}
                whileHover={canProceed ? "hover" : {}}
                whileTap={canProceed ? "tap" : {}}
            >
                {isLastStep ? 'Submit →' : 'Next →'}
            </motion.button>
        </motion.div>
    );
};

export default NavigationButtons;