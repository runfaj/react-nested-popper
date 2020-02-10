import React from 'react';
import classnames from 'classnames/bind';
import { BrowserRouter as Router, NavLink, Switch, Route } from 'react-router-dom';

import { Popper, Target, Content } from '../src';
import styles from './app.scss';

const cx = classnames.bind(styles);

const ParentComp = () => (
  <div>
    <Router>
      <Switch>
        <Route path="/">
          <ChildComp />
        </Route>
      </Switch>
    </Router>
  </div>
);

const ChildComp = () => (
  <Popper targetToggle>
    <Target className={cx('target')}>
      <button>Open Popper</button>
    </Target>
    <Content
      includeArrow
      className={cx('content', 'nested-0')}
      portalClassName={cx('portal')}
      arrowClassName={cx('arrow')}
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ],
      }}
    >
      <PopperContent />
    </Content>
  </Popper>
);

const PopperContent = () => (
  <div>
    <NavLink
      to="/"
      onClick={() => alert('you just clicked a nested nav link!')}
    >
      Some link text
    </NavLink>
  </div>
);

export default ParentComp;
