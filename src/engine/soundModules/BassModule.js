import Soundfont from 'soundfont-player';
import { getBassNote } from '../OctavianHelpers';

export default class BassModule {
  constructor(nSong, nContext) {
    this.song = nSong;
    this.context = nContext;
    this.beatInterval = 60.0 / (this.song.tempo * 4.0);
    this.gain = 1.0;
    this.voice = null;
    this.parameters = {
      'Chorus': 0.15,
      'Sustain': 0.5
    };
  }

  async init() {
    return Soundfont.instrument(this.context, 'lead_8_bass__lead').then((synth) => {
      this.voice = synth;
      return Promise.resolve();
    });
  }

  setGain(nGain) {
    this.gain = nGain * 1.0;
  }

  play(beat, bar, pattern) {
    const interval = pattern.split(',')[beat];
    if (interval === '-') return;
    let note = getBassNote(this.song.key, this.song.progression[bar], this.song.minor, parseFloat(interval));

    this.voice.play(note, this.context.currentTime, {
      duration: this.parameters['Sustain'] * this.beatInterval,
      gain: this.gain
    });

    this.voice.play(note + this.parameters['Chorus'], this.context.currentTime, {
      duration: this.parameters['Sustain'] * this.beatInterval,
      gain: this.gain * 0.8
    });
  }
}
