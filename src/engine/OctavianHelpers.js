import { Note, Chord } from 'octavian';

export function getBassNote(rootNote, chord, minorScale, interval) {
  let note = new Note(rootNote+'2');
  note = getRelativeNote(getProgressionChord(note, chord, minorScale), interval, chord < 0);
  return note.pianoKey + 20;
}

export function getLeadNote(rootNote, minorScale, interval) {
  let note = new Note(rootNote+'4');
  note = getPentatonicNote(note, interval, minorScale);
  return note.pianoKey + 20;
}

export function getbackingChord(rootNote, chord, minorScale) {
  let note = new Note(rootNote+'4');
  note = new Chord(getProgressionChord(note, chord, minorScale).signature, getChordName(chord));;
  return note.pianoKeys.map((key) => {
    return key + 20;
  });
}

function getProgressionChord(rootNote, chordDegree, minorScale) {
  var chord = Math.abs(chordDegree % 10);
  switch(chord) {
  case 2:
    return rootNote.majorSecond();
  case 3:
    return minorScale ? rootNote.minorThird() : rootNote.majorThird();
  case 4:
    return rootNote.perfectFourth();
  case 5:
    return rootNote.perfectFifth();
  case 6:
    return minorScale ? rootNote.minorSixth() : rootNote.majorSixth();
  case 7:
    return minorScale ? rootNote.minorSeventh() : rootNote.majorSeventh();
  default:
    return rootNote;
  }
}

function getChordName(chordDegree) {
  return `${chordDegree < 0 ? 'minor' : 'major'}${Math.abs(chordDegree)>=10?'Seventh':''}`
}

function getRelativeNote(note, interval, minor) {
  switch(interval) {
  case 0:
    return note.downOctave();
  case 0.125:
    note = minor ? note.minorThird() : note.majorThird();
    return note.downOctave();
  case 0.25:
    return note.perfectFifth().downOctave();
  case 0.375:
    note = minor ? note.minorSeventh() : note.majorSixth();
    return note.downOctave();
  case 0.625:
    return minor ? note.minorThird() : note.majorThird();
  case 0.75:
    return note.perfectFifth();
  case 0.875:
    return minor ? note.minorSeventh() : note.majorSixth();
  case 1:
    return note.perfectOctave();
  default:
    return note;
  }
}

function getPentatonicNote(note, interval, minor) {
  switch (interval) {
  case 1:
    return minor ? note.minorThird() : note.majorSecond();
  case 2:
    return minor ? note.perfectFourth() : note.majorThird();
  case 3:
    return note.perfectFifth();
  case 4:
    return minor ? note.minorSeventh() : note.majorSixth();
  case 5:
    return note.perfectOctave();
  case 6:
    note = note.perfectOctave();
    return minor ? note.minorThird() : note.majorSecond();
  case 7:
    note = note.perfectOctave();
    return minor ? note.perfectFourth() : note.majorThird();
  case 8:
    return note.perfectOctave().perfectFifth();
  case 9:
    return note.perfectOctave().perfectOctave();
  default:
    return note;
  }
}
