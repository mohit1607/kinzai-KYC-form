import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { animations } from "../utils";

const PhotoCapture = ({ onPhotoCapture, pictureData, warning }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraAvailable, setCameraAvailable] = useState(true);

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraAvailable(false);
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
            });

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    const capturePicture = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/png');
        onPhotoCapture(imageData, cameraAvailable);

        if (video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
        }
    };

    return (
        <motion.div variants={animations.item}>
            <label className="block text-lg font-medium text-gray-700 mb-2">Take a Picture</label>
            <AnimatePresence>
                {warning && (
                    <motion.p
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-red-600 mb-4 font-semibold bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                        {warning}
                    </motion.p>
                )}
            </AnimatePresence>

            {cameraAvailable ? (
                <>
                    <motion.video
                        ref={videoRef}
                        className="rounded-xl shadow-lg w-full max-h-96 object-cover mb-4 bg-black"
                        autoPlay
                        muted
                        playsInline
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <motion.button
                        type="button"
                        onClick={capturePicture}
                        className="mb-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
                        variants={animations.button}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        📸 Capture Picture
                    </motion.button>
                    <AnimatePresence>
                        {pictureData && (
                            <motion.img
                                src={pictureData}
                                alt="Captured"
                                className="rounded-xl shadow-md w-full max-h-96 object-contain border-4 border-green-200"
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                        )}
                    </AnimatePresence>
                    <canvas ref={canvasRef} className="hidden" />
                </>
            ) : (
                <motion.p
                    className="text-gray-500 italic bg-gray-50 p-4 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    No camera detected on this device.
                </motion.p>
            )}
        </motion.div>
    );
};

export default PhotoCapture