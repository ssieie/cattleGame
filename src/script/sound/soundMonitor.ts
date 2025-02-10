function getMicrophoneInput(): Promise<MediaStream> {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        resolve(stream); // 成功返回音频流
      })
      .catch((err) => {
        reject(`无法访问麦克风: ${err}`);
      });
  });
}

let analyser: AnalyserNode, buffer: Uint8Array;

function analyzeMicrophone(stream: MediaStream) {
  const audioContext = new window.AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 512;
  const source = audioContext.createMediaStreamSource(stream);
  const bufferLength = analyser.frequencyBinCount; // 获取频率数据的长度
  buffer = new Uint8Array(bufferLength); // 用于存储频率数据

  // 连接音频流到Analyser节点
  source.connect(analyser);
  analyser.connect(audioContext.destination);
}

function initSoundMonitor() {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await getMicrophoneInput();
      analyzeMicrophone(stream);
      resolve("");
    } catch (e) {
      reject(e);
    }
  });
}

function updateSoundData(): Uint8Array | undefined {
  if (analyser) {
    analyser.getByteFrequencyData(buffer);
    return buffer;
  }
}

export { initSoundMonitor, updateSoundData };
