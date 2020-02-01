import React from 'react';
import classnames from 'classnames/bind';

import PopperThing from './PopperThing';

import Queue from '../src/Queue';
window.Queue = Queue;

import styles from './app.scss';

const cx = classnames.bind(styles);

const App = () => (
  <div className={cx('app')}>
    <PopperThing
      text="This is a default popper with styling and arrow added"
    />
    <PopperThing
      text="Another one placed to the left"
      placement="left"
    />
    <PopperThing
      text="This one will close when clicking outside the popper content area"
      closeOnOutsideClick
    />
    <PopperThing
      text="Let's try a nested popper"
      groupName="nested"
    >
      <PopperThing
        text="This is a nested popper"
        nestedLevel={1}
        groupName="nested"
      />
    </PopperThing>
  </div>
);

export default App;
