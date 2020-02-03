import React from 'react';
import { Popper, Target, Content } from '../src';
import classnames from 'classnames/bind';

import styles from './popperThing.scss';

const cx = classnames.bind(styles);

const PopperThing = ({
  placement = 'bottom',
  closeOnOutsideClick = false,
  children,
  nestedLevel = 0,
  groupName,
}) => (
  <Popper
    targetToggle
    closeOnOutsideClick={closeOnOutsideClick}
    groupName={groupName}
  >
    <Target className={cx('target')}><PopperTarget /></Target>
    <Content
      className={cx('content', `nested-${nestedLevel}`)}
      portalClassName={cx('portal')}
      includeArrow
      arrowClassName={cx('arrow')}
      popperOptions={{
        placement,
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
      <PopperContent>
        {children}
      </PopperContent>
    </Content>
  </Popper>
);

const PopperTarget = () => (
  <button type="button">Toggle Popper</button>
);

const PopperContent = ({ children }) => (
  <div>
    <div>This is some popper content. Hooray.</div>
    {children}
  </div>
);

export default PopperThing;
