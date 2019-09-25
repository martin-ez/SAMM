const animals = require('animals');
const { Note } = require('octavian');
const values = require('./SongValues.json');

function convertProgression(progression, key, minor) {
  const rootStr = key+'4';
  return progression.map((c, bar) => {
    let note = new Note(rootStr);
    const chord = Math.abs(progression[bar]);
    switch(chord) {
      case 2:
        note = note.majorSecond();
        break;
      case 3:
        note = !minor ? note.majorThird() : note.minorThird();
        break;
      case 4:
        note = note.perfectFourth();
        break;
      case 5:
        note = note.perfectFifth();
        break;
      case 6:
        note = !minor ? note.majorSixth() : note.minorSixth();
        break;
      case 7:
        note = !minor ? note.majorSeventh() : note.minorSeventh();
        break;
    }
    return `${note.letter}${note.modifier?'#':''}${c<0?'m':''}`;
  });
}

function randomSong() {
  const newSong = {
    bandName: '',
    tempo: 0,
    key: '',
    minor: false,
    progression: [],
    chords: [],
    backingSound: ''
  };

  const a = animals();
  newSong.bandName = `The ${values.colors[Math.floor(Math.random() * values.colors.length)]} ${a.charAt(0).toUpperCase() + a.slice(1)}s`;
  newSong.tempo = Math.round((Math.random() * 75) + 75);
  newSong.key = values.keys[Math.floor(Math.random() * values.keys.length)];
  newSong.progression = values.progressions[Math.floor(Math.random() * values.progressions.length)];
  newSong.minor = newSong.progression[0] < 0;
  newSong.chords = convertProgression(newSong.progression, newSong.key, newSong.minor);
  newSong.backingSound = values.sounds[Math.floor(Math.random() * values.sounds.length)];

  return newSong;
}

function createSession() {
  return {
    private: false,
    song: randomSong(),
    currentPlayers: 1,
    audience: 0,
    drums: {
      player: '',
      pattern: [
        '-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-',
        '-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-',
        '-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,',
        '-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,'
      ]
    },
    bass: {
      player: '',
      pattern: '-,-,-,-,-,-,-,-,-,-,-,-,-,-,-,-'
    },
    lead: {
      player: '',
      pattern: [
        '-,-,-,-,-,-,-,-',
        '-,-,-,-,-,-,-,-',
        '-,-,-,-,-,-,-,-',
        '-,-,-,-,-,-,-,-'
      ]
    }
  };
}

module.exports = createSession;
