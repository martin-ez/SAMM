import Soundfont from 'soundfont-player';
import { getLeadNote } from '../OctavianHelpers';

export default class LeadModule {
  constructor(nSong, nContext) {
    this.song = nSong;
    this.context = nContext;
    this.beatInterval = 60.0 / (this.song.tempo * 2.0);
    this.gain = 1.0;
    this.voice = null;
    this.parameters = {
      'Chorus': 0.05,
      'Sustain': 0.9
    };
  }

  async init(song) {
    return Soundfont.instrument(this.context, 'alto_sax').then((synth) => {
      this.voice = synth;
      return Promise.resolve();
    });
  }

  setGain(nGain) {
    this.gain = nGain * 1.0;
  }

  play(beat, bar, pattern) {
    const interval = pattern[bar].split(',')[beat/2];
    if (interval === '-' || beat % 2 === 1) return;
    let note = getLeadNote(this.song.key, this.song.minor, parseInt(interval));

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
