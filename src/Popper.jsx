import React from 'react';

const Popper = ({
  target = null,
  content = null,
}) => (
  <div data-test="test">
    <div>{target}</div>
    <div>{content}</div>
  </div>
);

export default Popper;
