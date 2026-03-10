// 1. Import the file directly so React strictly bundles the correct URL!
import jumpSfx from "../assets/jump.mp3";

// 2. Initialize the audio object
const jumpSound = new Audio(jumpSfx);

// I increased this to 0.4 (40%) just in case your file is naturally quiet!
jumpSound.volume = 0.4;

export const playJumpSound = () => {
  try {
    jumpSound.currentTime = 0;

    // play() returns a Promise. This will catch and log any silent browser blocks in the console!
    const playPromise = jumpSound.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn("Browser blocked jump sound:", error);
      });
    }
  } catch (err) {
    console.warn("Audio play failed:", err);
  }
};
