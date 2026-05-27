import { useEffect, useRef } from 'react';

export function useAmbientSound(isActive: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (audioCtxRef.current && gainNodeRef.current) {
        // Fade out before closing
        const ctx = audioCtxRef.current;
        const gain = gainNodeRef.current;
        gain.gain.setTargetAtTime(0, ctx.currentTime, 2.0);
        setTimeout(() => {
          if (ctx.state !== 'closed') ctx.close();
          audioCtxRef.current = null;
        }, 3000);
      }
      return;
    }

    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Master gain for fade in/out
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.setTargetAtTime(0.4, ctx.currentTime + 1.0, 3.0); // Slow fade in
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Create a deep, warm drone using stacked oscillators
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(108.0, ctx.currentTime); // Low A

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(54.0, ctx.currentTime); // Lower A

      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(110.5, ctx.currentTime); // Slight detune for phasing

      // Filter to remove high frequencies and make it muffled/underwater
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);

      // LFO for breathing effect (modulates filter frequency and gain slightly)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.125, ctx.currentTime); // 8 second period (breathing)

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(50, ctx.currentTime); // Depth of filter modulation

      const lfoAmp = ctx.createGain();
      lfoAmp.gain.setValueAtTime(0.15, ctx.currentTime); // Depth of volume modulation

      // Connections
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      lfo.connect(lfoAmp);
      
      const droneMix = ctx.createGain();
      droneMix.gain.setValueAtTime(0.6, ctx.currentTime);

      // Add LFO to the drone mix gain
      // Create a constant source for the base gain, then add LFO
      const constant = ctx.createOscillator();
      constant.type = 'square';
      constant.frequency.setValueAtTime(0, ctx.currentTime); // 0Hz = constant DC offset
      // A trick to get a constant value is difficult in standard Web Audio without ConstantSourceNode
      // Let's just modulate the master gain directly with the LFO
      
      const lfoVolGain = ctx.createGain();
      lfoVolGain.gain.value = 0.2; // 20% volume modulation
      lfo.connect(lfoVolGain.gain);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);

      filter.connect(droneMix);
      droneMix.connect(masterGain);
      
      // We'll modulate the droneMix gain directly
      const volModulator = ctx.createGain();
      lfo.connect(volModulator);
      volModulator.gain.value = 0.3; // 30% modulation depth
      volModulator.connect(droneMix.gain);

      osc1.start();
      osc2.start();
      osc3.start();
      lfo.start();

      // Ensure context is running (browsers suspend it until user interaction, 
      // but they just clicked the button so we are good).
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

    } catch (e) {
      console.warn("Web Audio API not supported or failed to start", e);
    }

    return () => {
      // Cleanup if component unmounts abruptly
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [isActive]);
}
