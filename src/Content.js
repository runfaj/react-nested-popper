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

    // we add a unique id so the queue can easily find instances as needed
    this.id = _.uniqueId();
  }

  componentDidMount() {
    // if show was initially enabled, init popperjs immediately
    if (this.props._show) {
      this.initPopperInstance();
    }
  }

  componentDidUpdate() {
    // watch prop changes to see if we need to init or update the popperjs instance
    // if not show, we kill the instance and clean up refs
    if (this.props._show) {
      if (!this.popperInstance) {
        this.initPopperInstance();
      } else {
        this.popperInstance.setOptions(this.popperOptions);
      }
    } else {
      this.destroyPopperInstance();
    }
  }

  componentWillUnmount() {
    this.destroyPopperInstance();
  }

  /*  called if queue wants to hide this popper */
  componentWillDestroy() {
    this.props._onComponentWillDestroy();
  }

  /*  init popperjs */
  initPopperInstance() {
    // only init if we actually have a target and popper element to bind to
    if (this.popperEl && this.props._targetRef && !this.popperInstance) {
      this.popperInstance = createPopper(this.props._targetRef, this.popperEl, this.props.popperOptions);
      // push this instance to the queue so the queue can manage it
      Queue._push(this, this.props._queue);
      document.addEventListener('click', this.onOutsideClick);
    }
  }

  /*  destroy popperjs */
  destroyPopperInstance() {
    if (this.popperInstance) {
      document.removeEventListener('click', this.onOutsideClick);
      this.popperInstance.destroy();
      this.popperInstance = null;
      // remove this instance from the queue
      Queue._removeBy(this);
    }
    this.popperEl = null;
    this.portalEl = null;
  }

  /*  sets the ref for the popperjs content so it can be bound. Also provide to user if they want it */
  setPopperRef = (el) => {
    this.popperEl = el;
    if (this.props.innerRef) {
      this.props.innerRef(el);
    }
  }

  /*  track the portal ref, used for outside click checking */
  setPortalRef = (el) => {
    this.portalEl = el;
  }

  /*  any click outside the portal or popper should trigger an outside click */
  onOutsideClick = (e) => {
    if (this.portalEl) {
      if (!this.portalEl.contains(e.target)) {
        this.props._onOutsideClick(this, e);
      }
    } else if (!this.popperEl || !this.popperEl.contains(e.target)) {
      this.props._onOutsideClick(this, e);
    }
  }

  render() {
    if (!this.props._targetRef || !this.props._show) {
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

    if (this.props._usePortal) {
      return (
        <Portal
          portalRoot={this.props._portalRoot}
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

// see docs for definitions of each external prop here
Content.propTypes = {
  // external
  arrowClassName: PropTypes.string,
  className: PropTypes.string,
  includeArrow: PropTypes.bool,
  innerRef: PropTypes.func,
  onClick: PropTypes.func,
  popperOptions: PropTypes.object,
  portalClassName: PropTypes.string,
  
  // internal - these can't be required otherwise will show error to end user
  _onComponentWillDestroy: PropTypes.func,
  _onOutsideClick: PropTypes.func,
  _portalRoot: PropTypes.element,
  _queue: PropTypes.string,
  _show: PropTypes.bool,
  _targetRef: PropTypes.any,
  _usePortal: PropTypes.bool,
};
Content.defaultProps = {
  arrowClassName: '',
  className: '',
  includeArrow: false,
  innerRef: (el) => {},
  onClick: (e) => {},
  popperOptions: {},
  portalClassName: '',
  
  _onComponentWillDestroy: () => {},
  _onOutsideClick: (instance, e) => {},
  _portalRoot: null,
  _queue: 'global',
  _show: false,
  _targetRef: null,
  _usePortal: true,
};
