import React from 'react';
import classnames from 'classnames/bind';

import styles from './displayBlock.scss';

const cx = classnames.bind(styles);

const DisplayBlock = ({
  description,
  example,
  code,
  notes
}) => (
  <div className={cx('displayBlock')}>
    <div className={cx('description')}>
      {description}
    </div>
    <div className={cx('content')}>
      <div className={cx('leftContent')}>
        {example}
      </div>
      <div className={cx('rightContent')}>
        <pre>{code}</pre>
      </div>
    </div>
    <div className={cx('notes')}>
      {notes}
    </div>
  </div>
);

export default DisplayBlock;
