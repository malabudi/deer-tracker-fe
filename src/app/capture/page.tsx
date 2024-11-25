'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import DeerCamera from '@/components/deer-camera/DeerCamera';
import Loader from '@/components/loader/Loader';
import BottomNav from '@/components/bottom-nav/BottomNav';
import { cooldownTime, detectCooldown } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { createDeerSighting } from '@/hooks/apis/useDeerSighting';
import { useLocationContext } from '@/context/LocationProvider';
import axios from 'axios';
import { throttle } from 'lodash';

export default function Capture() {
  const API_PATH = process.env.NEXT_PUBLIC_API_PATH;
  const [loading, setLoading] = useState(true);
  const { userLocation } = useLocationContext();
  const confidenceThreshold = 0.75; // As a decimal which automatically is read as a percentage

  // Define references to be used later
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cooldowns
  const saveCooldownRef = useRef(false);

  const useCreateDeerSighting = useMutation({
    mutationFn: createDeerSighting,
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const SaveDeer = useCallback(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      const curDate = new Date().toDateString();

      useCreateDeerSighting.mutate({
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        timestamp: curDate,
      });
    } else {
      console.error('Location is invalid');
    }
  }, [userLocation, useCreateDeerSighting]);

  const playDetectionSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.error('Audio playback error:', error));
    }
  }, []);

  const drawPredictions = (predictions: any) => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!ctx || !video || !canvas) {
      console.error('Canvas or video context not available.');
      return;
    }

    // Debug: (do not remove)
    console.log({
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    });

    // Clear all boxes
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Use video and canvas dimensions to calculate X and Y scales
    const videoWidth = video?.videoWidth ?? 0;
    const videoHeight = video?.videoHeight ?? 0;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate scale
    const scaleX = canvasWidth / videoWidth;
    const scaleY = canvasHeight / videoHeight;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (canvasWidth - videoWidth * scale) / 2;
    const offsetY = (canvasHeight - videoHeight * scale) / 2;

    // Define box styling
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.textBaseline = 'bottom';
    ctx.font = '12px sans-serif';

    predictions.forEach((prediction: any) => {
      // parse each prediction element for the box dimensions
      const { class: className, confidence, x, y, width, height } = prediction;

      console.log(prediction);

      if (confidence >= confidenceThreshold) {
        // Scale and position the bounding box, applying offsets
        const scaledX = x * scale + offsetX;
        const scaledY = y * scale + offsetY;
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // Prediction text/accuracy mainly used for debuggging, this will be hidden in prod
        const predText = `${className} ${(confidence * 100).toFixed(2)}%`;
        const textWidth = ctx.measureText(predText).width;
        const textHeight = parseInt(ctx.font, 10);

        // Debug: (do not remove)
        console.log({
          x,
          y,
          width,
          height,
          scaledX,
          scaledY,
          scaledWidth,
          scaledHeight,
        });

        // Draw bounding box and label
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
        ctx.fillStyle = '#F00';
        ctx.fillRect(
          scaledX - ctx.lineWidth / 2,
          scaledY,
          textWidth + ctx.lineWidth,
          -textHeight
        );
        ctx.fillStyle = '#FFF';
        ctx.fillText(predText, scaledX, scaledY);
      }
    });
  };

  const detectDeer = throttle(async (base64Image: any) => {
    try {
      const response = await axios.post(`${API_PATH}/detect`, {
        image: base64Image,
      });

      const predictions = response.data;
      console.log('Predictions:', predictions);

      // Filter predictions based on confidence
      const highConfidencePredictions = predictions.predictions.filter(
        (prediction: any) => prediction.confidence >= confidenceThreshold
      );
      console.log('Filtered Predictions:', highConfidencePredictions);

      // Process predictions
      if (highConfidencePredictions && highConfidencePredictions.length > 0) {
        playDetectionSound();

        // Save deer sighting
        if (!saveCooldownRef.current) {
          SaveDeer();

          // save cooldown
          saveCooldownRef.current = true;
          setTimeout(() => {
            saveCooldownRef.current = false;
          }, cooldownTime);
        }

        // Draw box based on predictions
        drawPredictions(highConfidencePredictions);
      }
    } catch (err: any) {
      console.error(
        'Error during detection:',
        err.response?.data || err.message
      );
    }
  }, detectCooldown);

  const detectFrame = useCallback(() => {
    if (videoRef.current) {
      // Capture frame from video
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');

      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // grab image and let detectDeer convert fully to Base64
      const imageData = canvas.toDataURL('image/jpeg', 1.0);
      const base64Image = imageData.split(',')[1];

      if (base64Image) detectDeer(base64Image);
    }

    requestAnimationFrame(detectFrame);
  }, [detectDeer]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    // handle resizing for video and canvas (highlighting box)
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const handleResize = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };

    video.addEventListener('loadedmetadata', handleResize);

    audioRef.current = new Audio(
      'https://66e37eaa4d733664b5abd9ad--boisterous-crisp-b60fea.netlify.app/Detected.mp3'
    );
    audioRef.current.volume = 1;

    const constraints = {
      audio: false,
      video: { facingMode: 'environment' },
    };

    // Check user's browser media capabilities
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }

          // Call detect deer frame by frame within the camera
          detectFrame();
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          alert('Error accessing camera: You need to allow camera access.');
        });
    } else {
      alert("Your browser doesn't support camera access.");
    }

    setLoading(false); // Set loading to false once video starts

    return () => {
      video.removeEventListener('loadedmetadata', handleResize);
    };
  }, [detectDeer, detectFrame]);

  return (
    <div className={styles.pageWrapper}>
      {loading && <Loader />}
      <DeerCamera videoRef={videoRef} canvasRef={canvasRef} />
      <BottomNav />
    </div>
  );
}
