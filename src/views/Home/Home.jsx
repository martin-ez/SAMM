import React, { useState, useEffect } from 'react';
import './Home.scss';

import SoundEngine from '../../engine/SoundEngine';
import createSession from './SongGenerator';


function Home() {
  const [session, setSession] = useState(createSession());
  const [loading, setLoading] = useState(false);
  let engine = new SoundEngine(session.song);

  function startEngine() {
    setLoading(true);
    engine.updatePattern({
      backing: [],
      drums: session.drums.pattern,
      bass: session.bass.pattern,
      lead: session.lead.pattern
    });
    engine.initSounds().then(() => {
      setLoading(false);
      engine.play();
    });
  }

  return (
    <section className="Home">
      <h1 className="Home__Title">SAMM</h1>
      <h2 className="Home__Subtitle">Social Adaptable Music Maker</h2>
      {loading ?
        <h1>Loading Sounds</h1>
      :
        <div className="Home__StartButtons">
          <button onClick={startEngine}>Make Music</button>
        </div>
      }
    </section>
  );
}

export default Home;
