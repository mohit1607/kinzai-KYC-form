import { useRef, useState } from "react";
import { motion } from "motion/react";
import { animations } from "../utils"; // Adjust the import path as necessary

const SignatureCanvas = ({ onSignatureChange, signatureData }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        const rect = canvas.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();
        onSignatureChange(dataUrl);
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        onSignatureChange(null);
    };

    return (
        <motion.div variants={animations.item}>
            <label className="block text-lg font-medium text-gray-700 mb-2">Digital Signature</label>
            <p className="text-sm text-gray-500 mb-4">Sign inside the box below</p>
            <motion.div
                className="border rounded-xl bg-white shadow-sm overflow-hidden"
                whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.2 }}
            >
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="rounded-xl w-full cursor-crosshair"
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
            </motion.div>
            <motion.button
                type="button"
                onClick={clearSignature}
                className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
                variants={animations.button}
                whileHover="hover"
                whileTap="tap"
            >
                Clear Signature
            </motion.button>
        </motion.div>
    );
};

export default SignatureCanvas