import React from 'react';
import classnames from 'classnames/bind';
import { Provider, observer, inject } from 'mobx-react';
import { types } from 'mobx-state-tree';

import { Popper, Target, Content } from '../src';
import styles from './app.scss';

const cx = classnames.bind(styles);

const ExampleStore = types.model({
  count: types.optional(types.number, 0),
})
  .actions(self => ({
    incrementCount() {
      self.count += 1;
    },
  }));

const ProviderComp = () => (
  <Provider
    exampleStore={ExampleStore.create()}
  >
    <ChildComp />
  </Provider>
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

const PopperContent = inject('exampleStore')(observer(({ exampleStore }) => (
  <div>
    <div>Click the button to change the counter in the store.</div>
    <button onClick={exampleStore.incrementCount}>Increment Count</button>
    <div>The current count is: {exampleStore.count}</div>
  </div>
)));

export default ProviderComp;
