import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class Target extends React.Component {
  static className = 'react-nested-popper_Target';

  elementRef = null;

  setRef(el) {
    this.elementRef = el;
    if (this.props.innerRef) {
      this.props.innerRef(el);
    }
    if (this.props._targetRef) {
      this.props._targetRef(el);
    }
  }

  render() {
    const rest = _.omit(this.props, _.keys(Target.propTypes));

    return (
      <div
        className={this.props.className}
        ref={el => this.setRef(el)}
        onClick={this.props._onClick}
        {...rest}
      >
        {this.props.children}
      </div>
    );
  }
}

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
