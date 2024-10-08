'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import DeerCamera from '@/components/deer-camera/DeerCamera';
import Loader from '@/components/loader/Loader';
import BottomNav from '@/components/bottom-nav/BottomNav';
import { API_PATH, cooldownTime } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { createDeerSighting } from '@/hooks/apis/useDeerSighting';
import { useLocationContext } from '@/context/LocationContext';
import axios from 'axios';

export default function Capture() {
  const [loading, setLoading] = useState(true);
  const { userLocation } = useLocationContext();

  // Define references to be used later
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // True = on cooldown, dont save
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

  const detectDeer = useCallback(
    async (base64Image: any) => {
      try {
        const response = await axios.post(`${API_PATH}/detect`, {
          image: base64Image,
        });

        const predictions = response.data;
        console.log(predictions);

        // Process predictions
        if (predictions && predictions.predictions.length > 0) {
          // Play sound on detection
          playDetectionSound();

          // Save deer sighting
          if (!saveCooldownRef.current) {
            SaveDeer();
            saveCooldownRef.current = true;
            setTimeout(() => {
              saveCooldownRef.current = false;
            }, cooldownTime);
          }

          // Draw bounding boxes, etc. based on predictions
          drawPredictions(predictions);
        }
      } catch (err: any) {
        console.error(
          'Error during detection:',
          err.response?.data || err.message
        );
      }
    },
    [SaveDeer, playDetectionSound]
  );

  const drawPredictions = (predictions: any) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      predictions.predictions.forEach((prediction: any) => {
        const { bbox, class: className, confidence } = prediction; // Adjust based on actual response structure

        // Draw bounding box and label
        const [x, y, width, height] = bbox; // Ensure bbox structure matches what Roboflow returns
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        ctx.fillStyle = 'red';
        ctx.fillText(
          `${className} (${(confidence * 100).toFixed(2)}%)`,
          x,
          y > 10 ? y - 5 : 10
        );
      });
    }
  };

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

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

          // Detect deer frame by frame within the camera
          const detectFrame = () => {
            if (videoRef.current) {
              // Capture frame from video
              const canvas = document.createElement('canvas');
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              const ctx = canvas.getContext('2d');

              ctx?.drawImage(
                videoRef.current,
                0,
                0,
                canvas.width,
                canvas.height
              );

              // grab image and let detectDeer convert fully to Base64
              const imageData = canvas.toDataURL('image/jpeg', 1.0);
              const base64Image = imageData.split(',')[1];

              if (base64Image) detectDeer(base64Image);
            }

            requestAnimationFrame(detectFrame);
          };

          detectFrame(); // Start frame detection
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
          alert('Error accessing camera: You need to allow camera access.');
        });
    } else {
      alert("Your browser doesn't support camera access.");
    }

    setLoading(false); // Set loading to false once video starts
  }, [detectDeer]);

  return (
    <div className={styles.pageWrapper}>
      {loading && <Loader />}
      <DeerCamera videoRef={videoRef} canvasRef={canvasRef} />
      <BottomNav />
    </div>
  );
}
