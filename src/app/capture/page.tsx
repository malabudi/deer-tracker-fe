'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import styles from './page.module.css';
import DeerCamera from '@/components/deer-camera/DeerCamera';
import BottomNav from '@/components/bottom-nav/BottomNav';
import Loader from '@/components/loader/Loader';

export default function Capture() {
  const [loading, setLoading] = useState(true);

  // This line is where training models will be loaded
  // Loading the model comes with a Promise. Will proceed only when the promise is fulfilled.
  const modelPromise = import('@tensorflow-models/coco-ssd').then(
    (cocoSsd: any) => cocoSsd.load('lite_mobilenet_v2')
  );

  // Define references to be used later
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Utilities functions
  const detection = useCallback((video: HTMLVideoElement, model: any) => {
    // Ensure video is ready
    if (video.readyState === 4) {
      setTimeout(() => {
        model.detect(video).then((predictions: any) => {
          drawBBox(predictions);
        });

        requestAnimationFrame(() => detection(video, model));
      }, 100);
    }
  }, []);

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
    if (!videoRef.current || !canvasRef.current) return;

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
