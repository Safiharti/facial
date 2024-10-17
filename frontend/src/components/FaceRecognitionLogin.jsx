import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { Loader2, AlertCircle, CheckCircle2, Camera, RefreshCw } from "lucide-react";
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/face-recognition';
const MODEL_URL = '/models';
const DETECTION_INTERVAL = 100;

function FaceRecognitionLogin() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const [status, setStatus] = useState({
    isLoading: true,
    isModelLoading: true,
    isCameraReady: false,
    isDetecting: false,
    loginStatus: null,
    error: null,
    recognizedUser: null
  });

  // Cleanup function
  const cleanup = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  }, []);

  // Cleanup camera stream
  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Handle component unmount
  useEffect(() => {
    return () => {
      cleanup();
      cleanupCamera();
    };
  }, [cleanup, cleanupCamera]);

  // Start video stream
  const startVideo = useCallback(async () => {
    try {
      // Clean up any existing stream
      cleanupCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user"
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStatus(prev => ({ ...prev, isCameraReady: true, error: null }));
      }
    } catch (err) {
      console.error('Camera error:', err);
      setStatus(prev => ({
        ...prev,
        error: `Camera access denied: ${err.message}`,
        isCameraReady: false
      }));
    }
  }, [cleanupCamera]);

  // Load face-api models
  const loadModels = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isModelLoading: true }));
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);

      setStatus(prev => ({
        ...prev,
        isModelLoading: false,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Model loading error:', error);
      setStatus(prev => ({
        ...prev,
        isModelLoading: false,
        isLoading: false,
        error: `Error loading models: ${error.message}`
      }));
    }
  }, []);

  // Initialize on component mount
  useEffect(() => {
    loadModels();
    startVideo();
  }, [loadModels, startVideo]);

  // Face detection function
  const detectFace = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not ready');
      return;
    }

    // Clear any existing detection interval
    cleanup();

    setStatus(prev => ({ ...prev, isDetecting: true }));

    detectionIntervalRef.current = setInterval(async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || video.readyState !== 4) {
          console.log('Video not ready yet');
          return;
        }

        // Update canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Detect face
        console.log('Attempting face detection...');
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
          console.log('Face detected!');
          const dims = faceapi.matchDimensions(canvas, video, true);
          const resizedDetection = faceapi.resizeResults(detection, dims);
          
          // Draw detection results
          faceapi.draw.drawDetections(canvas, [resizedDetection]);
          faceapi.draw.drawFaceLandmarks(canvas, [resizedDetection]);

          // Stop detection and process login
          cleanup();
          await handleFaceLogin(detection.descriptor);
        } else {
          console.log('No face detected in this frame');
        }
      } catch (err) {
        console.error('Detection error:', err);
        cleanup();
        setStatus(prev => ({
          ...prev,
          isDetecting: false,
          error: `Detection error: ${err.message}`,
          loginStatus: 'error'
        }));
      }
    }, DETECTION_INTERVAL);
  }, [cleanup]);

  const handleFaceLogin = async (faceDescriptor) => {
    try {
      const response = await axios.post(API_URL, {
        faceDescriptor: Array.from(faceDescriptor)
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      setStatus(prev => ({
        ...prev,
        isDetecting: false,
        loginStatus: response.data.success ? 'success' : 'error',
        error: !response.data.success ? response.data.message : null,
        recognizedUser: response.data.success ? response.data.user : null
      }));
    } catch (err) {
      console.error('Login error:', err);
      setStatus(prev => ({
        ...prev,
        isDetecting: false,
        loginStatus: 'error',
        error: err.response?.data?.message || 'Face recognition failed',
        recognizedUser: null
      }));
    }
  };

  const handleReset = useCallback(() => {
    cleanup();
    setStatus(prev => ({
      ...prev,
      loginStatus: null,
      error: null,
      isDetecting: false,
      recognizedUser: null
    }));
    startVideo();
  }, [cleanup, startVideo]);

  const handleStartDetection = useCallback(() => {
    if (!status.isCameraReady) {
      setStatus(prev => ({
        ...prev,
        error: 'Camera is not ready. Please wait or refresh the page.'
      }));
      return;
    }
    
    setStatus(prev => ({ ...prev, error: null }));
    detectFace();
  }, [detectFace, status.isCameraReady]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Face Recognition Login
        </h1>
        
        <div className="relative aspect-video mb-4 bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onLoadedMetadata={() => setStatus(prev => ({ ...prev, isCameraReady: true }))}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
          {status.isDetecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {status.isLoading && (
            <div className="flex items-center justify-center p-4 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Initializing system...</span>
            </div>
          )}

          {status.error && (
            <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg border border-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{status.error}</p>
            </div>
          )}

          {status.loginStatus === 'success' && (
            <div className="flex items-center gap-2 p-4 text-green-600 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p>Login successful! Welcome, {status.recognizedUser}!</p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            {!status.isLoading && status.isCameraReady && !status.isDetecting && !status.loginStatus && (
              <button
                onClick={handleStartDetection}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                disabled={!status.isCameraReady}
              >
                <Camera className="w-5 h-5" />
                <span>Start Detection</span>
              </button>
            )}

            {(status.loginStatus || status.error) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            )}
          </div>

          <div className="flex justify-center items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.isCameraReady ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">Camera</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${!status.isModelLoading ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm text-gray-600">Models</span>
            </div>
            {status.isDetecting && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-sm text-gray-600">Detecting</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRecognitionLogin;