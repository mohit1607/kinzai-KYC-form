import { motion, AnimatePresence } from "motion/react";
import { animations } from "../utils"; // Adjust the import path as necessary


const FormInput = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    onKeyDown,
    error,
    inputRef,
    required = false
}) => {
    return (
        <motion.div variants={animations.item}>
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                ref={inputRef}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                className="mt-1 w-full p-3 rounded-xl bg-white shadow-sm focus:outline-blue-400 transition-all duration-200 focus:shadow-md"
            />
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm mt-1"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
};


export default FormInput;