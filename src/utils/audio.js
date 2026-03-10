import jumpSfx from "../assets/jump.mp3";

// 1. Create the Web Audio API Context (with fallback for Safari)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let jumpBuffer = null;

// 2. Fetch the MP3 and perfectly decode it into the phone's RAM (Memory)
fetch(jumpSfx)
  .then((response) => response.arrayBuffer())
  .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
  .then((decodedAudio) => {
    jumpBuffer = decodedAudio;
  })
  .catch((err) => console.warn("Failed to load jump audio:", err));

export const playJumpSound = () => {
  try {
    // iOS pauses all audio contexts until the user taps the screen. This wakes it up instantly.
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (!jumpBuffer) return; // Failsafe if they jump before the 0.1sec it takes to load

    // 3. Create an instantaneous playback node
    const source = audioCtx.createBufferSource();
    source.buffer = jumpBuffer;

    // 4. Create a volume node
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.4; // 40% volume

    // 5. Connect them together and play with zero delay!
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    source.start(0);
  } catch (err) {
    console.warn("Audio play failed:", err);
  }
};
