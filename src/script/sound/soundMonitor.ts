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

function getBassAndTreble(): number | undefined {
  if (analyser) {
    analyser.getByteFrequencyData(buffer);

    // 低音区间
    const bassRange = buffer.slice(0, 50);
    const bass =
      bassRange.reduce((sum, v) => sum + v, 0) / bassRange.length || 0;

    // 高音区间（约 4kHz - 20kHz）
    const trebleRange = buffer.slice(200, 255);
    const treble =
      trebleRange.reduce((sum, v) => sum + v, 0) / trebleRange.length || 0;

    // 计算结果（调整 50 为中间值）
    let result = 50 + (treble - bass) * 0.5; // 0.5 是缩放系数，可调整

    // 限制 1 - 100 范围
    result = Math.min(100, Math.max(1, result));

    return Math.round(result);
  }
}

export { initSoundMonitor, getBassAndTreble };
