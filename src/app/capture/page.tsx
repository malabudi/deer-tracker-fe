'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import styles from './page.module.css';
import DeerCamera from '@/components/deer-camera/DeerCamera';
import Loader from '@/components/loader/Loader';
import BottomNav from '@/components/bottom-nav/BottomNav';
import { cooldownTime } from '@/utils/constants';
import { useMutation } from '@tanstack/react-query';
import { createDeerSighting } from '@/hooks/apis/useDeerSighting';
import { useLocationContext } from '@/context/LocationContext';

export default function Capture() {
  const [loading, setLoading] = useState(true);
  const { userLocation } = useLocationContext();

  const useCreateDeerSighting = useMutation({
    mutationFn: createDeerSighting,
    onSuccess: (res) => {
      console.log('Deer Saved to System');
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    console.log('Updated userLocation:', userLocation);
    console.log(userLocation?.latitude);
    console.log(userLocation?.longitude);
  }, [userLocation]);

  const SaveDeer = useCallback(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      const curDate = new Date().toDateString();
      console.log(
        'Saving Sighting:',
        curDate,
        userLocation.longitude,
        userLocation.latitude
      );

      useCreateDeerSighting.mutate({
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        timestamp: curDate,
      });
    } else {
      console.log('Location is invalid');
    }
  }, [userLocation, useCreateDeerSighting]);

  // This line is where training models will be loaded
  // Loading the model comes with a Promise. Will proceed only when the promise is fulfilled.
  const modelPromise = import('@tensorflow-models/coco-ssd').then(
    (cocoSsd: any) => cocoSsd.load('lite_mobilenet_v2')
  );

  // Define references to be used later
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // True = on cooldown, dont save
  // False = not on cooldown, can save
  const saveCooldownRef = useRef(false);

  const playDetectionSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.error('Audio playback error:', error));
    }
  }, []);

  // Utilities functions
  const detection = useCallback(
    (video: HTMLVideoElement, model: any) => {
      // Ensure video is ready
      if (video.readyState === 4) {
        setTimeout(() => {
          model.detect(video).then((predictions: any) => {
            // Play sound when an object is detected
            if (predictions.length > 0) {
              playDetectionSound();

              // Set flag for any function during detection to trigger once and not loop
              if (!saveCooldownRef.current) {
                SaveDeer();
                saveCooldownRef.current = true; // Set true to avoid spamming API requests

                setTimeout(() => {
                  saveCooldownRef.current = false;
                }, cooldownTime);
              }
            }

            drawBBox(predictions);
          });

          requestAnimationFrame(() => detection(video, model));
        }, 100);
      }
    },
    [SaveDeer, playDetectionSound]
  );

  const drawBBox = (predictions: any) => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;

    if (ctx) {
      ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Grab the scale of x and y depending on viewport
      const videoWidth = videoRef.current?.videoWidth ?? 0;
      const videoHeight = videoRef.current?.videoHeight ?? 0;
      const scaleX = (canvasRef.current?.width ?? 0) / videoWidth;
      const scaleY = (canvasRef.current?.height ?? 0) / videoHeight;

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.textBaseline = 'bottom';
      ctx.font = '12px sans-serif';

      predictions.forEach((prediction: any) => {
        const [x, y, width, height] = prediction.bbox;

        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        const predText = `${prediction.class} ${(prediction.score * 100).toFixed(2)}%`;
        const textWidth = ctx.measureText(predText).width;
        const textHeight = parseInt(ctx.font, 10);

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
      });
    } else {
      console.error('Canvas context is not available.');
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    audioRef.current = new Audio(
      'https://66e37eaa4d733664b5abd9ad--boisterous-crisp-b60fea.netlify.app/Detected.mp3'
    );
    audioRef.current.volume = 1;

    // Set TensorFlow.js backend
    tf.setBackend('webgl').then(() => {
      // Define the constraints for the mediaDevices
      const constraints = {
        audio: false,
        video: { facingMode: 'environment' },
      };

      // Check user's browser media capabilities
      if (navigator.mediaDevices.getUserMedia) {
        const camPromise = navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              return new Promise(
                (resolve) => (videoRef.current!.onloadedmetadata = resolve)
              );
            }
          })
          .catch((err) => {
            // TODO: Display some message to the UI to activiate camera
            console.log(err + ' => you must activate your camera.');
          });

        // Start detection once both the model and the camera are ready.
        Promise.all([modelPromise, camPromise])
          .then((values) => {
            if (videoRef.current) {
              detection(videoRef.current, values[0]);
              setLoading(false);
            }
          })
          .catch((error) => console.error(error));
      } else {
        alert("Your browser doesn't support this function.");
      }
    });
  }, [detection, modelPromise]);

  return (
    <div className={styles.pageWrapper}>
      {loading && <Loader />}
      <DeerCamera videoRef={videoRef} canvasRef={canvasRef} />
      <BottomNav />
    </div>
  );
}
