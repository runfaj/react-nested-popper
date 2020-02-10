import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/*  the implementation of this is a pretty standard portal. The only difference is we provide the ref for 
    outside click handling and allow adding a class name. This component is completely internal.
*/
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

  get portalRoot() {
    return this.props.portalRoot || document.getElementsByTagName('body')[0];
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.portalEl);
  }
}

// no docs on these, all internal
Portal.propTypes = {
  // all of these are internal
  className: PropTypes.string,
  innerRef: PropTypes.func,
  portalRoot: PropTypes.element, // can be directly added, or comes from Popper
};
Portal.defaultProps = {
  className: '',
  innerRef: (el) => {},
  portalRoot: null,
};
