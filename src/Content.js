import React from 'react';
import PropTypes from 'prop-types';
import { createPopper } from '@popperjs/core';
import _ from 'lodash';

import Queue from './Queue';
import Portal from './Portal';

export default class Content extends React.Component {
  static className = 'react-nested-popper_Content';

  popperEl = null;
  portalEl = null;
  popperInstance = null;

  constructor(props) {
    super(props);

    this.id = _.uniqueId();
  }

  componentDidMount() {
    if (this.props.show) {
      this.initPopperInstance();
    }
  }

  componentDidUpdate() {
    if (this.props.show) {
      if (!this.popperInstance) {
        this.initPopperInstance();
      } else {
        // probably should have a check here to only do this if options changed
        this.popperInstance.setOptions(this.popperOptions);
      }
    } else {
      this.destroyPopperInstance();
      this.popperEl = null;
      this.portalEl = null;
    }
  }

  componentWillUnmount() {
    this.destroyPopperInstance();
  }

  // called if queue wants to hide this popper
  componentWillDestroy() {
    this.props.onComponentWillDestroy();
  }

  initPopperInstance() {
    if (this.popperEl && this.props.targetRef && !this.popperInstance) {
      this.popperInstance = createPopper(this.props.targetRef, this.popperEl, this.props.popperOptions);
      Queue.push(this, this.props.queue);
      document.addEventListener('click', this.onOutsideClick);
    }
  }

  destroyPopperInstance() {
    if (this.popperInstance) {
      document.removeEventListener('click', this.onOutsideClick);
      this.popperInstance.destroy();
      this.popperInstance = null;
      Queue.removeBy(this);
    }
  }

  setPopperRef = (el) => {
    this.popperEl = el;
    if (this.props.innerRef) {
      this.props.innerRef(el);
    }
  }

  setPortalRef = (el) => {
    this.portalEl = el;
  }

  onOutsideClick = (e) => {
    if (!this.portalEl || !this.portalEl.contains(e.target)) {
      this.props.onOutsideClick(this, e);
    }
  }

  render() {
    if (!this.props.targetRef || !this.props.show) {
      return null;
    }

    const popper = (
      <div
        className={this.props.className}
        ref={this.setPopperRef}
        onClick={this.props.onClick}
      >
        {this.props.children}
        {this.props.includeArrow && (
          <div className={this.props.arrowClassName} data-popper-arrow />
        )}
      </div>
    );

    if (this.props.usePortal) {
      return (
        <Portal
          portalRoot={this.props.portalRoot}
          className={this.props.portalClassName}
          innerRef={this.setPortalRef}
        >
          {popper}
        </Portal>
      );
    }

    return popper;
  }
}

Content.propTypes = {
  // external
  arrowClassName: PropTypes.string,
  className: PropTypes.string,
  includeArrow: PropTypes.bool,
  innerRef: PropTypes.func,
  onClick: PropTypes.func,
  popperOptions: PropTypes.object,
  portalClassName: PropTypes.string,
  portalRoot: PropTypes.element, // can be directly added, or comes from Popper
  usePortal: PropTypes.bool,

  // internal - these can't be required unless you want it to show to end user
  onComponentWillDestroy: PropTypes.func,
  onOutsideClick: PropTypes.func,
  queue: PropTypes.string,
  show: PropTypes.bool,
  targetRef: PropTypes.any,
};
Content.defaultProps = {
  arrowClassName: '',
  className: '',
  includeArrow: false,
  innerRef: (el) => {},
  onClick: (e) => {},
  popperOptions: {},
  portalClassName: '',
  portalRoot: null,
  usePortal: true,

  onComponentWillDestroy: () => {},
  onOutsideClick: (instance, e) => {},
  queue: 'global',
  show: false,
  targetRef: null,
};
