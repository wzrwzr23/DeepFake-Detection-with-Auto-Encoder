import React, { useEffect, useRef } from 'react';
const VideoStreamCanvas = ({ streamUrl }) => {
  const canvasRef = useRef(null);
  const readerRef = useRef(null);
  const frameIntervalRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set your stream's frame size
    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;

    let buffer = new Uint8Array(); // Buffer to accumulate incoming data

    // Find a sequence of bytes in a Uint8Array
    const findMarker = (marker, buffer, start = 0) => {
      for (let i = start; i < buffer.length - marker.length + 1; i++) {
        let match = true;
        for (let j = 0; j < marker.length; j++) {
          if (buffer[i + j] !== marker[j]) {
            match = false;
            break;
          }
        }
        if (match) return i;
      }
      return -1; // Marker not found
    };

    const processStream = async () => {
      while (true) {
        const response = await fetch(streamUrl);
        readerRef.current = response.body.getReader();

        while (true) {
          const { done, value } = await readerRef.current.read();
          if (done) break;

          // Append new chunk to the buffer
          let newBuffer = new Uint8Array(buffer.length + value.length);
          newBuffer.set(buffer);
          newBuffer.set(value, buffer.length);
          buffer = newBuffer;

          let start = 0;
          let end;

          // JPEG Start Of Image (SOI) and End Of Image (EOI) markers
          const SOI_MARKER = new Uint8Array([0xFF, 0xD8]);
          const EOI_MARKER = new Uint8Array([0xFF, 0xD9]);

          // Loop through the buffer to find each JPEG frame
          while ((start = findMarker(SOI_MARKER, buffer, start)) !== -1) {
            end = findMarker(EOI_MARKER, buffer, start + 2);

            if (end === -1) break; // If EOI not found, break to wait for more data

            // Extract the frame and create a Blob
            const frameData = buffer.slice(start, end + 2); // Include SOI and EOI
            const blob = new Blob([frameData], { type: 'image/jpeg' });

            // Render the frame after the interval
            frameIntervalRef.current = setTimeout(() => {
              const imageUrl = URL.createObjectURL(blob);
              const image = new Image();
              image.onload = () => {
                context.clearRect(0, 0, width, height); // Clear the canvas
                context.drawImage(image, 0, 0, width, height);
                URL.revokeObjectURL(imageUrl);
              };
              image.src = imageUrl;
            }, 100); // Render one frame every 0.1 second

            // Prepare buffer for next frame
            buffer = buffer.slice(end + 2);
            start = 0; // Reset start index to beginning of the buffer
          }
        }
      }
    };

    processStream();

    return () => {
      if (readerRef.current) {
        readerRef.current.cancel();
      }
      clearTimeout(frameIntervalRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [streamUrl]); // Re-run effect if streamUrl changes

  return <canvas ref={canvasRef} />;
};

export default VideoStreamCanvas;