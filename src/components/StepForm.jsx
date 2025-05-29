import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SuccessMessage from './SuccessMessage';
import FormInput from './FormInput';
import Progressbar from './Progressbar'
import NavigationButtons from './NavigationButtons';
import { animations } from '../utils';





// ===== PERSONAL INFO STEP COMPONENT =====
const PersonalInfoStep = ({ formData, errors, onInputChange, onKeyDown, inputRefs }) => {
    const fields = [
        { key: 'fullName', label: 'Full Legal Name', placeholder: 'As per official government ID' },
        { key: 'dob', label: 'Date of Birth', type: 'date', placeholder: '' },
        { key: 'nationality', label: 'Nationality', placeholder: 'For tax and compliance checks' },
        { key: 'address', label: 'Residential Address', placeholder: 'Verified using a valid document' },
        { key: 'govID', label: 'Government-issued ID', placeholder: 'Passport, National ID card, or Driving License' }
    ];

    return (
        <motion.div
            className="grid grid-cols-1 gap-6"
            variants={animations.container}
        >
            {fields.map((field) => (
                <FormInput
                    key={field.key}
                    label={field.label}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => onInputChange(field.key, e.target.value)}
                    onKeyDown={(e) => onKeyDown(e, field.key)}
                    error={errors[field.key]}
                    inputRef={inputRefs[field.key]}
                    required
                />
            ))}
        </motion.div>
    );
};






// ===== MAIN STEP FORM COMPONENT =====
const StepForm = () => {
    const [step, setStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [warning, setWarning] = useState('');
    const [signatureData, setSignatureData] = useState(null);
    const [pictureData, setPictureData] = useState(null);
    const [cameraAvailable, setCameraAvailable] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        nationality: '',
        address: '',
        govID: '',
    });
    const [errors, setErrors] = useState({});

    const inputRefs = {
        fullName: useRef(null),
        dob: useRef(null),
        nationality: useRef(null),
        address: useRef(null),
        govID: useRef(null),
    };

    const stepTitles = ['Personal Information', 'Digital Signature', 'Photo Verification'];

    // Auto-focus first field when step 0 loads
    useEffect(() => {
        if (step === 0) {
            setTimeout(() => {
                inputRefs.fullName.current?.focus();
            }, 100);
        }
    }, [step]);

    // Handle Enter key navigation
    const handleKeyDown = (e, currentField) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const fieldOrder = ['fullName', 'dob', 'nationality', 'address', 'govID'];
            const currentIndex = fieldOrder.indexOf(currentField);

            if (currentIndex < fieldOrder.length - 1) {
                const nextField = fieldOrder[currentIndex + 1];
                inputRefs[nextField].current?.focus();
            } else {
                handleNext();
            }
        }
    };

    // Validate form data
    const validateStep = () => {
        const newErrors = {};

        if (step === 0) {
            if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
            if (!formData.dob) newErrors.dob = 'Date of birth is required';
            if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
            if (!formData.address.trim()) newErrors.address = 'Address is required';
            if (!formData.govID.trim()) newErrors.govID = 'ID is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle photo capture
    const handlePhotoCapture = (imageData, cameraAvailable) => {
        setPictureData(imageData);
        setCameraAvailable(cameraAvailable);
    };

    // Handle form submission for each step
    const handleNext = () => {
        if (step === 0) {
            if (!validateStep()) return;
            setStep(1);
        } else if (step === 1) {
            if (!signatureData) {
                alert('Please provide your digital signature before continuing.');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!cameraAvailable) {
                alert('Camera not available. Cannot continue.');
                return;
            }
            if (!pictureData) {
                alert('Please take a picture before continuing.');
                return;
            }
            setIsCompleted(true);
        }
    };

    // Go back to previous step
    const handleBack = () => {
        if (step > 0) {
            setWarning('');
            setStep(step - 1);
        }
    };

    // Determine if user can proceed
    const canProceed = () => {
        if (step === 2) return cameraAvailable && pictureData;
        return true;
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto mt-12 p-8 bg-[#f5faff] shadow-xl rounded-2xl border border-blue-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <motion.h2
                className="text-3xl font-bold text-blue-700 mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                Identity Verification
            </motion.h2>

            <Progressbar
                currentStep={step}
                totalSteps={3}
                stepTitles={stepTitles}
            />

            <AnimatePresence mode="wait">
                {isCompleted ? (
                    <SuccessMessage key="completed" />
                ) : (
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                variants={animations.container}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {step === 0 && (
                                    <PersonalInfoStep
                                        formData={formData}
                                        errors={errors}
                                        onInputChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        inputRefs={inputRefs}
                                    />
                                )}

                                {step === 1 && (
                                    <SignatureCanvas
                                        onSignatureChange={setSignatureData}
                                        signatureData={signatureData}
                                    />
                                )}

                                {step === 2 && (
                                    <PhotoCapture
                                        onPhotoCapture={handlePhotoCapture}
                                        pictureData={pictureData}
                                        warning={warning}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <NavigationButtons
                            currentStep={step}
                            onNext={handleNext}
                            onBack={handleBack}
                            canProceed={canProceed()}
                            isLastStep={step === 2}
                        />
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default StepForm;