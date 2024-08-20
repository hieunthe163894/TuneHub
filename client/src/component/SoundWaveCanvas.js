// import React, { useEffect, useRef } from 'react';

// export default function SoundWaveCanvas({ audioSource }) {
//   const audioElementRef = useRef(null);
//   const analyserRef = useRef(null);

//   useEffect(() => {
//     const canvas = document.getElementById("canvas");
//     const ctx = canvas.getContext("2d");

//     // Create audio context and analyser node
//     const context = new AudioContext();
//     const analyser = context.createAnalyser();
//     analyser.fftSize = 256;

//     analyserRef.current = analyser;

//     // Connect audio element to analyser
//     const audioElement = document.getElementById("audio");
//     audioElementRef.current = audioElement;

//     const audioSourceNode = context.createMediaElementSource(audioElement);
//     audioSourceNode.connect(analyser);
//     analyser.connect(context.destination);

//     // Render function to draw the canvas
//     function renderFrame() {
//       requestAnimationFrame(renderFrame);
//       const bufferLength = analyser.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);

//       analyser.getByteFrequencyData(dataArray);
//       const WIDTH = canvas.width;
//       const HEIGHT = canvas.height;
//       const barWidth = (WIDTH / bufferLength) * 2.5;
//       let x = 0;

//       ctx.fillStyle = "#000";
//       ctx.fillRect(0, 0, WIDTH, HEIGHT);

//       for (let i = 0; i < bufferLength; i++) {
//         const barHeight = dataArray[i];
//         const r = barHeight + (1 * (i / bufferLength));
//         const g = 250 * (i / bufferLength);
//         const b = 50;
//         ctx.fillStyle = `rgb(${r},${g},${b})`;
//         ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
//         x += barWidth + 1;
//       }
//     }

//     // Event listener to trigger rendering when audio starts playing
//     audioElement.addEventListener("play", renderFrame);

//     return () => {
//       // Cleanup: remove event listener
//       audioElement.removeEventListener("play", renderFrame);
//     };
//   }, [audioSource]);

//   return (
//     <div id="content">
//       <canvas id="canvas" className="w-full h-32"></canvas>
//       <audio id="audio" className="w-72" controls>
//         <source src={audioSource} type="audio/mpeg" />
//       </audio>
//     </div>
//   );
// }
