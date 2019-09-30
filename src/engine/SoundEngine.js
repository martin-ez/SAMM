import BackingModule from './soundModules/BackingModule';
import DrumModule from './soundModules/DrumModule';
import BassModule from './soundModules/BassModule';
import LeadModule from './soundModules/LeadModule';

export default class SoundEngine {
  constructor(sessionSong) {
    this.song = sessionSong;
    this.context = new AudioContext();
    this.instruments = {
      drums: new DrumModule(),
      bass: new BassModule(sessionSong, this.context),
      lead: new LeadModule(sessionSong, this.context),
      backing: new BackingModule(sessionSong, this.context)
    }
    this.beat = -1;
    this.bar = 0;
    this.pattern = {
      backing: [],
      drums: [],
      bass: [],
      lead: []
    };
    this.interval = null;
  }

  async initSounds() {
    const promises = []
    Object.keys(this.instruments).forEach((instrument) => {
      promises.push(this.instruments[instrument].init());
    });
    return Promise.all(promises);
  }

  updatePattern(nPattern) {
    this.pattern = nPattern;
  }

  setVolume(instrument, gain) {
    this.instruments[instrument].setGain(gain);
  }

  playNotes(bar, beat, pattern) {
    Object.keys(this.instruments).forEach((instrument) => {
      this.instruments[instrument].play(beat, bar, pattern[instrument]);
    });
  }

  play() {
    this.beat = -1;
    this.bar = 0;
    this.interval = setInterval(() => {
      this.beat++;
      if (this.beat === 16) {
        this.beat = 0;
        this.bar++;
        if (this.bar === 4) {
          this.bar = 0;
        }
      }
      //console.log(this.beat, this.bar);
      this.playNotes(this.bar, this.beat, this.pattern);
    }, 60000 / (this.song.tempo * 4));
  }

  stop() {
    clearInterval(this.interval);
  }
}
