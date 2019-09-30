import Pizzicato from 'pizzicato';

export default class DrumModule {
  constructor() {
    this.gain = 0.75;
    this.sounds = [null, null, null, null];
  }

  async init() {
    return new Promise((resolve, reject) => {
      let soundsReady = 0;
      const soundNames = ['kick', 'snare', 'closedHats', 'openHats'];
      soundNames.forEach((sound, index) => {
        this.sounds[index] = new Pizzicato.Sound(`./drumSounds/${sound}.wav`, (err) => {
          if (err) {
            console.log(err);
            return reject(err);
          }
          soundsReady += 1;
          if (soundsReady === 4) return resolve();
        });
      });
    });
  }

  setGain(nGain) {
    this.gain = nGain * 1.0;
  }

  play(beat, bar, pattern) {
    this.sounds.forEach((sound, index) => {
      if (pattern[index].charAt(beat) === 'x') {
        sound.volume = this.gain;
        sound.stop();
        sound.play();
        if (index === 2) this.sounds[3].stop(); // Choke HiHats
      }
    });
  }
}
