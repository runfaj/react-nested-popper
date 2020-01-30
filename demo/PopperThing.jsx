import React from 'react';
import { Popper } from '../src';

console.log(test);

const PopperThing = () => (
  <div className="popperContainer">
    <div>Let&#39;s get this party started.</div>
    <PopperP />
  </div>
);

const PopperP = () => (
  <Popper
    target={<PopperTarget />}
    content={<PopperContent />}
  />
);

const PopperTarget = () => (
  <button type="button">This button will open a popper!</button>
);

const PopperContent = () => (
  <div>
    <div>This is some popper content. Hooray.</div>
    {/* <PopperP /> */}
  </div>
);

export default PopperThing;