import styles from './page.module.css';

export default function DeerCamera(props: any) {
  return (
    <div className={styles.container}>
      <video
        ref={props.videoRef}
        className={styles.cameraPosition}
        autoPlay
        playsInline
        muted
      />
      <canvas ref={props.canvasRef} className={styles.labelPosition} />
    </div>
  );
}
