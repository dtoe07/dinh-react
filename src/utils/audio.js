import jumpSfx from "../assets/jump.wav";

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let jumpBuffer = null;

// Use async/await for faster, prioritized fetching
const initAudio = async () => {
  try {
    const response = await fetch(jumpSfx);
    const arrayBuffer = await response.arrayBuffer();

    // Safest fallback pattern for iOS Safari
    audioCtx.decodeAudioData(
      arrayBuffer,
      (decodedAudio) => {
        jumpBuffer = decodedAudio;
      },
      (err) => console.warn("Failed to decode jump audio:", err)
    );
  } catch (err) {
    console.warn("Failed to load jump audio:", err);
  }
};

initAudio();

export const playJumpSound = () => {
  try {
    // Wake up iOS audio context
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    // If still downloading the .wav file, gracefully exit
    if (!jumpBuffer) return;

    const source = audioCtx.createBufferSource();
    source.buffer = jumpBuffer;

    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.4;

    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    source.start(0);
  } catch (err) {
    console.warn("Audio play failed:", err);
  }
};
