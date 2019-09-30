import Soundfont from 'soundfont-player';
import { getbackingChord } from '../OctavianHelpers';

export default class BackingModule {
  constructor(nSong, nContext) {
    this.song = nSong;
    this.context = nContext;
    this.beatInterval = 60.0 / (this.song.tempo * 0.25);
    this.gain = 0.5;
    this.voice = null;
  }

  async init(song) {
    return Soundfont.instrument(this.context, this.song.backingSound).then((synth) => {
      this.voice = synth;
      return Promise.resolve();
    });
  }

  setGain(nGain) {
    this.gain = nGain * 0.5;
  }

  play(beat, bar, pattern) {
    if (beat % 16 !== 0) return;
    let notes = getbackingChord(this.song.key, this.song.progression[bar], this.song.minor);

    notes.forEach((note) => {
      this.voice.play(note, this.context.currentTime, {
        duration: this.beatInterval * 0.98,
        gain: this.gain
      });
    });
  }
}
