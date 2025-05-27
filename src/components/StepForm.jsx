import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

const StepForm = () => {
    const [step, setStep] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [cameraAvailable, setCameraAvailable] = useState(true);
    const [warning, setWarning] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const signatureCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signatureData, setSignatureData] = useState(null);
    const [pictureData, setPictureData] = useState(null);

    // react-hook-form setup for step 1
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        defaultValues: {
            fullName: '',
            dob: '',
            nationality: '',
            address: '',
            govID: '',
        },
    });

    // Start camera for step 3
    useEffect(() => {
        if (step === 2) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setCameraAvailable(false);
                setWarning('Camera not available on this device. You cannot proceed.');
                return;
            }

            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    setCameraAvailable(true);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                    }
                })
                .catch(() => {
                    setCameraAvailable(false);
                    setWarning('Camera permission denied or not available. You cannot proceed.');
                });
        }
        // Cleanup camera on step change or unmount
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [step]);

    // Signature canvas drawing handlers
    const startDrawing = (e) => {
        const canvas = signatureCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#3b82f6'; // Tailwind blue-500
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = signatureCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        const canvas = signatureCanvasRef.current || signatureCanvasRef.current;
        const dataUrl = canvas.toDataURL();
        setSignatureData(dataUrl);
        setIsDrawing(false);
    };

    // Clear signature
    const clearSignature = () => {
        const canvas = signatureCanvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData(null);
    };

    // Capture picture from video stream
    const capturePicture = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        setPictureData(imageData);

        // Stop all video tracks to turn off camera
        if (video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        // Remove video srcObject to hide video preview
        video.srcObject = null;
    };

    // Handle form submission for each step
    const handleNext = async (data) => {
        if (step === 0) {
            // Validate Step 1 react-hook-form fields
            const valid = await trigger();
            if (!valid) return;
            setStep(1);
        } else if (step === 1) {
            // Validate signature present
            if (!signatureData) {
                alert('Please provide your digital signature before continuing.');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            // Validate picture present and camera available
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

    return (
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-[#f5faff] shadow-xl rounded-2xl border border-blue-200">
            <h2 className="text-3xl font-bold text-blue-700 mb-8">Identity Verification</h2>

            {isCompleted ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-green-600 text-xl font-medium"
                >
                    ✅ Success! Your information has been submitted.
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit(handleNext)} className="space-y-6">
                    <motion.div
                        key={step}
                        exit={{ opacity: 0, y: 20 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* STEP 1 - Personal Info */}
                        {step === 0 && (
                            <div className="grid grid-cols-1 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Legal Name</label>
                                    <input
                                        type="text"
                                        placeholder="As per official government ID"
                                        {...register('fullName', { required: 'Name is required' })}
                                        className="mt-1 w-full p-3 rounded-xl bg-white shadow-sm focus:outline-blue-400"
                                        autoFocus
                                    />
                                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        {...register('dob', { required: 'Date of birth is required' })}
                                        className="mt-1 w-full p-3 rounded-xl bg-white shadow-sm focus:outline-blue-400"
                                    />
                                    {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
                                </div>

                                {/* Nationality */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nationality</label>
                                    <input
                                        type="text"
                                        placeholder="For tax and compliance checks"
                                        {...register('nationality', { required: 'Nationality is required' })}
                                        className="mt-1 w-full p-3 rounded-xl bg-white shadow-sm focus:outline-blue-400"
                                    />
                                    {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality.message}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Residential Address</label>
                                    <input
                                        type="text"
                                        placeholder="Verified using a valid document"
                                        {...register('address', { required: 'Address is required' })}
                                        className="mt-1 w-full p-3 rounded-xl bg-white shadow-sm focus:outline-blue-400"
                                    />
                                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                                </div>

                                {/* Government-issued ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Government-issued ID</label>
                                    <input
                                        type="text"
                                        placeholder="Passport, National ID card, or Driving License"
                                        {...register('govID', { required: 'ID is required' })}
                                        className="mt-1 w-full p-3 rounded-xl bg-white shadow-sm focus:outline-blue-400"
                                    />
                                    {errors.govID && <p className="text-red-500 text-sm">{errors.govID.message}</p>}
                                </div>
                            </div>
                        )}

                        {/* STEP 2 - Signature */}
                        {step === 1 && (
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Digital Signature</label>
                                <p className="text-sm text-gray-500 mb-4">Sign inside the box below</p>
                                <div className="border rounded-xl bg-white shadow-sm">
                                    <canvas
                                        ref={signatureCanvasRef}
                                        width={600}
                                        height={200}
                                        className="rounded-xl w-full"
                                        onMouseDown={startDrawing}
                                        onMouseMove={draw}
                                        onMouseUp={stopDrawing}
                                        onMouseLeave={stopDrawing}
                                        onTouchStart={e => {
                                            e.preventDefault();
                                            const touch = e.touches[0];
                                            startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
                                        }}
                                        onTouchMove={e => {
                                            e.preventDefault();
                                            const touch = e.touches[0];
                                            draw({ clientX: touch.clientX, clientY: touch.clientY });
                                        }}
                                        onTouchEnd={e => {
                                            e.preventDefault();
                                            stopDrawing();
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={clearSignature}
                                    className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition"
                                >
                                    Clear Signature
                                </button>
                            </div>
                        )}

                        {/* STEP 3 - Picture */}
                        {step === 2 && (
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Take a Picture</label>
                                {warning && (
                                    <p className="text-red-600 mb-4 font-semibold">{warning}</p>
                                )}
                                {cameraAvailable ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            className="rounded-xl shadow-lg w-full max-h-96 object-cover mb-4 bg-black"
                                            autoPlay
                                            muted
                                            playsInline
                                        />
                                        <button
                                            type="button"
                                            onClick={capturePicture}
                                            className="mb-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                                        >
                                            Capture Picture
                                        </button>
                                        {pictureData && (
                                            <img
                                                src={pictureData}
                                                alt="Captured"
                                                className="rounded-xl shadow-md w-full max-h-96 object-contain"
                                            />
                                        )}
                                        {/* Hidden canvas for capturing */}
                                        <canvas ref={canvasRef} className="hidden" />
                                    </>
                                ) : (
                                    <p className="text-gray-500 italic">No camera detected on this device.</p>
                                )}
                            </div>
                        )}
                    </motion.div>

                    <div className="flex justify-between">
                        {step > 0 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800 transition"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={(step === 2 && (!cameraAvailable || !pictureData))}
                            className={`px-6 py-3 rounded-xl text-white font-medium transition
                ${step === 2 && (!cameraAvailable || !pictureData) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {step === 2 ? 'Submit' : 'Next'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default StepForm;
