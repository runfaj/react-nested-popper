import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Portal extends React.Component {
  portalEl = document.createElement('div');

  constructor(props) {
    super(props);

    this.props.innerRef(this.portalEl);
  }

  componentDidMount() {
    this.portalEl.className = this.props.className;
    this.portalRoot.appendChild(this.portalEl);
  }

  componentWillUnmount() {
    this.portalRoot.removeChild(this.portalEl);
  }

  // assignElementAttributes() {
  //   if (!this.element) {
  //     return;
  //   }

  //   // TODO possibly
  //   const {
  //     children,
  //     innerRef,
  //     portalRoot,
  //     targetRef,
  //     popperOptions,
  //     ...rest
  //   } = this.props;

  //   Object.keys(rest).forEach(key => {
  //     this.element[key] = rest[key];
  //   });
  // }

  get portalRoot() {
    return this.props.portalRoot || document.getElementsByTagName('body')[0];
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.portalEl);
  }
}

Portal.propTypes = {
  // all of these are internal
  className: PropTypes.string,
  portalRoot: PropTypes.element, // can be directly added, or comes from Popper
  innerRef: PropTypes.func,
};
Portal.defaultProps = {
  className: '',
  portalRoot: null,
  innerRef: () => {},
};
