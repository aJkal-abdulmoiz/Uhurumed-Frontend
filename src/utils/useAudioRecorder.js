import { useState, useRef, useCallback } from 'react';

export function useAudioRecorder() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); // Added to store the final blob
  const chunksRef = useRef([]);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  // Get the best supported MIME type
  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/mpeg',
      'audio/wav',
      'audio/ogg;codecs=opus'
    ];

    return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
  };

  const startRecording = useCallback(async () => {
    setStatus('idle');
    setError(null);
    setAudioBlob(null); // Reset previous blob
    chunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          channelCount: 1,
          sampleRate: 16000
        },
        video: false // Explicitly disable video
      });
      streamRef.current = stream;

      const options = {
        audioBitsPerSecond: 128000,
        mimeType: getSupportedMimeType()
      };

      const recorder = new MediaRecorder(stream, options);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onerror = (e) => {
        setError(`Recording error: ${e.error?.message || 'Unknown error'}`);
        setStatus('error');
      };

      recorder.onstart = () => {
        setStatus('recording');
      };

      recorder.start(1000); // Collect data every second
    } catch (err) {
      setError(`Recording failed: ${err.message}`);
      setStatus('error');
      throw err; // Re-throw to allow handling in component
    }
  }, []);

  const stopRecording = useCallback(async () => {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;
      if (!recorder || status !== 'recording') {
        reject(new Error('No active recording'));

        return;
      }

      recorder.onstop = async () => {
        setStatus('stopped');
        
        try {
          // Combine chunks and ensure proper type
          let blob = new Blob(chunksRef.current, { 
            type: chunksRef.current[0]?.type || 'audio/webm' 
          });

          // Convert to WAV format for Deepgram
          setIsConverting(true);
          const wavBlob = await convertToWav(blob);
          setAudioBlob(wavBlob); // Store the final blob
          setIsConverting(false);
          
          resolve(wavBlob);
        } catch (err) {
          setError(`Conversion failed: ${err.message}`);
          setStatus('error');
          reject(err);
        } finally {
          // Clean up
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          recorderRef.current = null;
          streamRef.current = null;
        }
      };

      recorder.stop();
    });
  }, [status]);

  // Convert any audio format to WAV
  const convertToWav = async (blob) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Calculate length for 16kHz sample rate
      const length = audioBuffer.length * (16000 / audioBuffer.sampleRate);
      
      // Create mono audio at 16kHz
      const offlineCtx = new OfflineAudioContext({
        numberOfChannels: 1,
        length: Math.ceil(length),
        sampleRate: 16000
      });

      const source = offlineCtx.createBufferSource();
      
      // Create a new buffer with the correct sample rate
      const newBuffer = offlineCtx.createBuffer(1, Math.ceil(length), 16000);
      const originalData = audioBuffer.getChannelData(0);
      const newData = newBuffer.getChannelData(0);
      
      // Resample the audio
      for (let i = 0; i < newData.length; i++) {
        const index = Math.floor(i * (audioBuffer.length / newData.length));
        newData[i] = originalData[index];
      }

      source.buffer = newBuffer;
      source.connect(offlineCtx.destination);
      source.start();

      const renderedBuffer = await offlineCtx.startRendering();

      // Convert to WAV
      const wavBuffer = encodeWAV(renderedBuffer.getChannelData(0), 16000);

      return new Blob([wavBuffer], { type: 'audio/wav' });
    } catch (err) {
      console.error('Conversion error:', err);
      throw new Error('Failed to convert audio to WAV format');
    }
  };

  // WAV encoder helper
  const encodeWAV = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    // Write the PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
  };

  const writeString = (view, offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  return {
    startRecording,
    stopRecording,
    audioBlob, // Now properly exposed
    status,
    error,
    isConverting
  };
}