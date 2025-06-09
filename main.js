const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Load and play a 3D positioned sound
async function play3DSound(url, x = 0, y = 0, z = -1) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;

  const panner = audioCtx.createPanner();
  panner.setPosition(x, y, z);
  panner.panningModel = 'HRTF';

  source.connect(panner);
  panner.connect(audioCtx.destination);

  source.start();
}

// Button triggers multiple 3D sounds
document.getElementById("listenBtn").addEventListener("click", () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();

  play3DSound('sounds/272506__sturmankin__lino_11a_sneakers_walk.wav', -1, 0, -2); // left
  setTimeout(() => play3DSound('sounds/763800__shangusburger__creaethr_crowd-of-demonic-whispers_shanevincent_gsc24_msdec-mkh435-spirit.wav', 1, 0, -1), 2000); // right
  setTimeout(() => play3DSound('sounds/71183__alexir__door-creak.mp3', 0, 0, -3), 4000); // center
});