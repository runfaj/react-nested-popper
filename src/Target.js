import React from 'react';
import PropTypes from 'prop-types';

export default class Target extends React.Component {
  static className = 'react-nested-popper_Target';


  /*  tracks ref so popperjs can be bound to it. Also provide to user if they want it.
      We wouldn't even need this component, but we need to guarantee a ref to the target,
      so we enforce this component.
  */
  setRef(el) {
    const { innerRef, _targetRef } = this.props;
    if (innerRef) {
      innerRef(el);
    }
    if (_targetRef) {
      _targetRef(el);
    }
  }

  render() {
    const {
      children,
      className,
      _onClick,
      innerRef,
      _targetRef,
      ...rest
    } = this.props;

    return (
      <div
        className={className}
        ref={el => this.setRef(el)}
        onClick={_onClick}
        {...rest}
      >
        {children}
      </div>
    );
  }
}

// see docs for definitions of each external prop here
Target.propTypes = {
  // external props
  className: PropTypes.string,
  innerRef: PropTypes.func,

  // internal props - these can't be required unless you want it to show to end user
  _onClick: PropTypes.func,
  _targetRef: PropTypes.func,
};
Target.defaultProps = {
  className: '',
  innerRef: (el) => {},

  _onClick: (e) => {},
  _targetRef: (el) => {},
};
