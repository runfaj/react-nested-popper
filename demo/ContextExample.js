import React from 'react';
import classnames from 'classnames/bind';

import { Popper, Target, Content } from '../src';
import styles from './app.scss';

const cx = classnames.bind(styles);
const Context = React.createContext('');

const ProviderComp = () => (
  <Context.Provider value="I'm a context value!">
    <ChildComp />
  </Context.Provider>
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
      <Context.Consumer>
        {value => (
          <div>The value from the context provider is: "{value}"</div>
        )}
      </Context.Consumer>
    </Content>
  </Popper>
);

export default ProviderComp;
