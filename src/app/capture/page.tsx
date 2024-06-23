'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as tf from '@tensorflow/tfjs';
import styles from "./page.module.css";


export default function Capture() {
  const cocoSsd = require('@tensorflow-models/coco-ssd');

  // This line is where training models will be loaded
  // Loading the model comes with a Promise. Will proceed only when the promise is fulfilled. 
  const modelPromise = cocoSsd.load('mobilenet_v2');

  // Define references to be used later
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport dimensions
  const [viewportWidth, setViewportWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  
  // Utilities functions
  const detection = (video: HTMLVideoElement, model: any) => {
    if (video.readyState === 4) { // Ensure video is ready
      model.detect(video).then((predictions: any) => {
        drawBBox(predictions);
      });
      requestAnimationFrame(() => detection(video, model));
    }
  };

  const drawBBox = (predictions: any) => {
    const ctx = canvasRef.current?.getContext('2d') ?? null;
    ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    if (ctx) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 4;
      ctx.textBaseline = 'bottom';
      ctx.font = '12px sans-serif';

      predictions.forEach((prediction: any) => {
        const predText = prediction.class + ' ' + (prediction.score * 100).toFixed(2);
        const textWidth = ctx.measureText(predText).width;
        const textHeight = parseInt(ctx.font, 10);

        ctx.strokeRect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
        ctx.fillStyle = '#F00';
        ctx.fillRect(prediction.bbox[0]-ctx.lineWidth/2, prediction.bbox[1], textWidth + ctx.lineWidth, -textHeight);
        ctx.fillStyle = '#FFF'
        ctx.fillText(predText, prediction.bbox[0], prediction.bbox[1]);
      });
    } 
    else {
      console.error('Canvas context is not available.');
    }
  };

  useEffect(() => {
    // Set TensorFlow.js backend
    tf.setBackend('webgl').then(() => {
        // update viewport dimensions
        setViewportWidth(window.innerWidth);
        setViewportHeight(window.innerHeight);

        // Define the constraints for the mediaDevices
        const constraints = {
            audio: false,
            video: {facingMode: 'environment'}
        };

        // Check user's browser media capabilities
        if (navigator.mediaDevices.getUserMedia) {
            const camPromise = navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    return new Promise(resolve => videoRef.current!.onloadedmetadata = resolve);
                }
            })
            .catch(err => {
                alert('You need to activate your camera and refresh the page!')
            });

            // Start detection once both the model and the camera are ready.
            Promise.all([modelPromise, camPromise])
            .then(values => {
                if (videoRef.current) {
                    detection(videoRef.current, values[0]);
                }
            })
            .catch(error => console.error(error));
        }
        else {
            alert('Your browser doesn\'t support this function. You may consider to install Google Chrome instead.');
        }
    });
}, [detection, modelPromise]);

    return (
        <>
            <h1>Capture My Drive</h1>
            <video
              ref={videoRef}
              className={styles.cameraPosition}
              autoPlay
              playsInline
              muted
              width={viewportWidth}
              height={viewportHeight}
            />
            <canvas
              ref={canvasRef}
              className={styles.labelPosition}
              width={viewportWidth}
              height={viewportHeight}
            />
            <Link href='/'>Go Back</Link>
        </>
    );
}