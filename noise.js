document.addEventListener("DOMContentLoaded", function () {
  const playBrook = document.getElementById("brook");
  const playDial = document.getElementById("dial");
  const playRing = document.getElementById("ring");
  const playOrg = document.getElementById("orgbrook");
  const numbersContainer = document.querySelector(".numbers");
  const dialNumbers = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "*",
    "0",
    "#",
  ];

  var audioCtx0;
  var audioCtx1;
  var audioCtx2;
  var audioCtx3;
  var audioCtx4;

  playOrg.addEventListener(
    "click",
    function () {
      if (!audioCtx0) {
        console.log("here");
        originalBrook();
        return;
      } else if (audioCtx0.state === "suspended") {
        audioCtx0.resume();
      } else if (audioCtx0.state === "running") {
        audioCtx0.suspend();
      }
    },
    false
  );

  playBrook.addEventListener(
    "click",
    function () {
      if (!audioCtx1) {
        console.log("here");
        playsBrook();
        return;
      } else if (audioCtx1.state === "suspended") {
        audioCtx1.resume();
      } else if (audioCtx1.state === "running") {
        audioCtx1.suspend();
      }
    },
    false
  );
  playDial.addEventListener(
    "click",
    function () {
      if (!audioCtx2) {
        console.log("here");
        playsDial();
        return;
      } else if (audioCtx2.state === "suspended") {
        audioCtx2.resume();
      } else if (audioCtx2.state === "running") {
        audioCtx2.suspend();
      }
    },
    false
  );
  playRing.addEventListener(
    "click",
    function () {
      if (!audioCtx3) {
        console.log("here");
        playsRing();
        return;
      } else if (audioCtx3.state === "suspended") {
        audioCtx3.resume();
      } else if (audioCtx3.state === "running") {
        audioCtx3.suspend();
      }
    },
    false
  );
  let buttonCount = 0;
  let currentRow;

  dialNumbers.forEach((number) => {
    if (buttonCount % 3 === 0) {
      currentRow = document.createElement("div");
      currentRow.classList.add("row");
      numbersContainer.appendChild(currentRow);
    }
    const button = document.createElement("button");
    button.textContent = number;
    button.style.width = "70px";
    button.style.height = "70px";
    button.style.lineHeight = "70px";
    button.style.color = "red";

    button.addEventListener("click", function () {
      if (dialFrequencies[number]) {
        callN(dialFrequencies[number]);
      } else {
        console.error("Frequency not found for dial number:", number);
      }
    });

    currentRow.appendChild(button);
    buttonCount++;
  });

  function playsRing() {
    if (!audioCtx3) {
      audioCtx3 = new AudioContext();
      const osc1 = audioCtx3.createOscillator();
      const osc2 = audioCtx3.createOscillator();
      osc1.frequency.value = 480;
      osc1.type = "sine";
      osc2.frequency.value = 440;
      osc2.type = "sine";
      const gainNode = audioCtx3.createGain();
      gainNode.gain.value = 0.125;

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx3.destination);
      osc1.start();
      osc2.start();
      // audioCtx3.osc1 = osc1;
      // audioCtx3.osc2 = osc2;
      // audioCtx3.gainNode = gainNode;
      function toggleGain() {
        if (gainNode.gain.value === 0) {
          gainNode.gain.value = 0.125;
        } else {
          gainNode.gain.value = 0;
        }
      }
      audioCtx3.toggleInterval = setInterval(toggleGain, 2000);
    } else {
      clearInterval(audioCtx3.toggleInterval);
      audioCtx3.osc1.stop();
      audioCtx3.osc2.stop();
      audioCtx3 = null;
    }
  }

  function playsDial() {
    audioCtx2 = new AudioContext();
    const osc1 = audioCtx2.createOscillator();
    const osc2 = audioCtx2.createOscillator();
    osc1.start(0);
    osc2.start(0);
    osc1.frequency.value = 350;
    osc1.type = "sine";
    osc2.frequency.value = 440;
    osc2.type = "sine";
    const gainNode = audioCtx2.createGain();
    gainNode.gain.value = 0.125;
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx2.destination);
    const fadeDuration = 20;
    const currentTime = audioCtx2.currentTime;
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + fadeDuration);

    setTimeout(function () {
      osc1.stop();
      osc2.stop();
      audioCtx2.close();
    }, fadeDuration * 1000);
  }
  function playsBrook() {
    audioCtx1 = new AudioContext();
    var bufferSize = 10 * audioCtx1.sampleRate,
      noiseBuffer = audioCtx1.createBuffer(1, bufferSize, audioCtx1.sampleRate),
      output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
      var brown = Math.random() * 2 - 1;

      output[i] = (lastOut + 0.02 * brown) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const brownNoise = audioCtx1.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);
    const lowPassfilter1 = audioCtx1.createBiquadFilter();
    lowPassfilter1.type = "lowpass";
    lowPassfilter1.frequency.value = 400;
    const lowPassfilter2 = audioCtx1.createBiquadFilter();
    lowPassfilter2.type = "lowpass";
    lowPassfilter2.frequency.value = 14;
    const highPassfilter = audioCtx1.createBiquadFilter();
    highPassfilter.type = "highpass";
    highPassfilter.frequency.value = 400;
    highPassfilter.Q.value = 1 / 0.03;
    const gainNode = audioCtx1.createGain();
    lowPassfilter2.connect(gainNode);
    gainNode.gain.value = 0.1;
    const tfreq = audioCtx1.createGain();
    tfreq.gain.value = 800;

    brownNoise.connect(lowPassfilter1).connect(highPassfilter);
    brownNoise.connect(lowPassfilter2).connect(tfreq);
    tfreq.connect(highPassfilter.frequency);

    highPassfilter.connect(gainNode).connect(audioCtx1.destination);
  }
  function originalBrook() {
    audioCtx0 = new AudioContext();
    var bufferSize = 10 * audioCtx0.sampleRate,
      noiseBuffer = audioCtx0.createBuffer(1, bufferSize, audioCtx0.sampleRate),
      output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
      var brown = Math.random() * 2 - 1;

      output[i] = (lastOut + 0.02 * brown) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const brownNoise = audioCtx0.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);
    const lowPassfilter1 = audioCtx0.createBiquadFilter();
    lowPassfilter1.type = "lowpass";
    lowPassfilter1.frequency.value = 400;

    const lowPassfilter2 = audioCtx0.createBiquadFilter();
    lowPassfilter2.type = "lowpass";
    lowPassfilter2.frequency.value = 14;

    const highPassfilter = audioCtx0.createBiquadFilter();
    highPassfilter.type = "highpass";
    highPassfilter.frequency.value = 400;
    brownNoise.connect(lowPassfilter1).connect(highPassfilter);
    brownNoise.connect(lowPassfilter2).connect(highPassfilter.frequency);
    highPassfilter.connect(audioCtx0.destination);
  }

  var dialFrequencies = {
    1: { f1: 697, f2: 1209 },
    2: { f1: 697, f2: 1336 },
    3: { f1: 697, f2: 1477 },
    4: { f1: 770, f2: 1209 },
    5: { f1: 770, f2: 1336 },
    6: { f1: 770, f2: 1477 },
    7: { f1: 852, f2: 1209 },
    8: { f1: 852, f2: 1336 },
    9: { f1: 852, f2: 1477 },
    "*": { f1: 941, f2: 1209 },
    0: { f1: 941, f2: 1336 },
    "#": { f1: 941, f2: 1477 },
  };
  function callN(freq) {
    audioCtx4 = new AudioContext();
    const osc1 = audioCtx4.createOscillator();
    const osc2 = audioCtx4.createOscillator();
    const lowPassFilter1 = audioCtx4.createBiquadFilter();
    osc1.start(0);
    osc2.start(0);
    osc1.frequency.value = freq.f1;
    //osc1.type = "sine";
    osc2.frequency.value = freq.f2;
    //osc2.type = "sine";
    const gainNode = audioCtx4.createGain();
    gainNode.gain.value = 0.125;
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(lowPassFilter1).connect(audioCtx4.destination);
    setTimeout(function () {
      osc1.stop();
      osc2.stop();
      audioCtx4.close();
    }, 300);
  }
});
