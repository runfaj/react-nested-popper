import React from 'react';
import PropTypes from 'prop-types';
import { createPopper } from '@popperjs/core';
import _uniqueId from 'lodash/uniqueId';

import Stack from './Stack';
import Portal from './Portal';

export default class Content extends React.Component {
  static className = 'react-nested-popper_Content';

  popperEl = null;
  portalEl = null;
  resizerEl = null;
  popperInstance = null;
  determinedStack = null;
  resizerEventAdded = false;
  positionPoller = null;
  lastTargetPos = [0, 0];
  targetParents = null;
  
  // used in stack so we don't duplicate call destroy
  isDestroying = false;

  constructor(props) {
    super(props);

    // we add a unique id so the stack can easily find instances as needed
    this.id = _uniqueId();
  }

  componentDidMount() {
    // if show was initially enabled, init popperjs immediately
    if (this.props._show) {
      this.initPopperInstance();
      this.initResizer();
    }
    if (this.props._targetRef) {
      this.targetParents = Stack._getTargetParents(this.props._targetRef);
    }
  }

  componentDidUpdate(prevProps) {
    // watch prop changes to see if we need to init or update the popperjs instance
    // if not show, we kill the instance and clean up refs
    if (this.props._show) {
      if (!this.popperInstance) {
        this.initPopperInstance();
        this.initResizer();
      } else {
        this.popperInstance.setOptions(this.popperOptions);
      }
    } else {
      this.destroyResizer();
      this.destroyPopperInstance();
    }
    if (prevProps._targetRef !== this.props._targetRef) {
      this.targetParents = Stack._getTargetParents(this.props._targetRef);
    }
  }

  componentWillUnmount() {
    this.destroyResizer();
    this.destroyPopperInstance();
  }

  /*  called if stack wants to hide this popper */
  componentWillDestroy() {
    this.isDestroying = true;
    this.props._onComponentWillDestroy();
  }

  /*  init popperjs */
  initPopperInstance() {
    // only init if we actually have a target and popper element to bind to
    if (this.popperEl && this.props._targetRef && !this.popperInstance) {
      this.popperInstance = createPopper(this.props._targetRef, this.popperEl, this.props.popperOptions);
      // push this instance to the stack so the stack can manage it
      let stack = this.props._stack;
      if (stack === 'auto') {
        const myTargetParents = Stack._getTargetParents(this.props._targetRef);
        if (!myTargetParents) {
          stack = ['_content' + this.id];
        } else {
          stack = Stack._reflow(this.props._targetRef, myTargetParents);
        }
      }
      this.determinedStack = stack;
      Stack._push(this, stack);
      document.addEventListener('click', this.onOutsideClick);

      setTimeout(() => {
        // after init, tell popper to relcalculate based on options in case it didn't do it properly the first time
        if (this.popperInstance) {
          this.popperInstance.update();
        }
      });
    }
  }

  /*  destroy popperjs */
  destroyPopperInstance() {
    if (this.popperInstance) {
      document.removeEventListener('click', this.onOutsideClick);
      this.popperInstance.destroy();
      this.popperInstance = null;
      // remove this instance from the stack
      Stack._removeBy(this);
    }
    this.popperEl = null;
    this.portalEl = null;
    this.isDestroying = false;
  }

  initResizer() {
    if (this.resizerEl && !this.resizerEventAdded) {
      if (!this.resizerEl.contentDocument) {
        this.resizerEl.addEventListener('load', this.initResizer);
        this.resizerEventAdded = null;
      } else {
        if (this.resizerEventAdded === null) {
          this.resizerEl.removeEventListener('load', this.initResizer);
        }
        if (this.props._targetRef) {
          this.lastTargetPos = this.props._targetRef.getBoundingClientRect();
        }
        this.positionPoller = setInterval(this.onCheckPosition, 50);
        this.resizerEl.contentDocument.defaultView.addEventListener('resize', this.onResize);
        this.resizerEventAdded = true;
      }
    }
  }

  destroyResizer() {
    if (this.resizerEl && this.resizerEl.contentDocument && this.resizerEventAdded) {
      this.resizerEl.contentDocument.defaultView.removeEventListener('resize', this.onResize);
    }
    if (this.positionPoller) {
      clearInterval(this.positionPoller);
      this.positionPoller = null;
    }
    this.resizerEventAdded = false;
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

  setResizerRef = (el) => {
    this.resizerEl = el;
  }

  onCheckPosition = () => {
    if (this.props._targetRef) {
      let { left: lastLeft, top: lastTop } = this.lastTargetPos;
      const thisTargetPos = this.props._targetRef.getBoundingClientRect();
      const { left, top } = thisTargetPos;

      if (lastLeft === 0 && lastTop === 0) {
        lastLeft = left;
        lastTop = top;
      }
      if (lastLeft !== left || lastTop !== top) {
        if (this.targetParents && this.popperInstance) { // only update for nested poppers
          this.popperInstance.update();
        }
      }
      this.lastTargetPos = thisTargetPos;
    }
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

  /*  update popper position on content resize */
  onResize = () => {
    if (this.popperInstance) {
      this.popperInstance.update();
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
        style={{ position: 'relative' }}
      >
        {this.renderResizerIframe()}
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
          className={this.props._portalClassName}
          innerRef={this.setPortalRef}
        >
          {popper}
        </Portal>
      );
    }

    return popper;
  }

  renderResizerIframe() {
    return (
      <iframe
        src="about:blank"
        ref={this.setResizerRef}
        aria-hidden
        tabIndex={-1}
        frameBorder={0}
        title="resizer"
        style={{
          display: 'block',
          opacity: 0,
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    );
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
  
  // internal - these can't be required otherwise will show error to end user
  _onComponentWillDestroy: PropTypes.func,
  _onOutsideClick: PropTypes.func,
  _portalClassName: PropTypes.string,
  _portalRoot: PropTypes.element,
  _stack: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
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
  
  _onComponentWillDestroy: () => {},
  _onOutsideClick: (instance, e) => {},
  _portalClassName: '',
  _portalRoot: null,
  _stack: 'auto',
  _show: false,
  _targetRef: null,
  _usePortal: true,
};
