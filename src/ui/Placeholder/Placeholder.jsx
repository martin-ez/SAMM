import React from 'react';
import './Placeholder.scss';

function Placeholder(props) {
  return (
    <section id="Placeholder">
      {props.text}
    </section>
  );
}

export default Placeholder;
