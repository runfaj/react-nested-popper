import React from 'react';
import PropTypes from 'prop-types';

import Target from './Target';
import Content from './Content';
import Queue from './Queue';

export default class Popper extends React.Component {
  static className = 'react-nested-popper_Popper';

  constructor(props) {
    super(props);

    this.validChildren = this.checkChildren(props.children);
    this.isManaged = this.checkIsManaged(props);

    this.state = {
      show: !!props.initiallyOpen, // managed popper uses state, otherwise user provides props.show
      targetRef: null, // we do this in the state instead of regular this assignment because we need to re-trigger a render when this updates
    };
  }

  shouldComponentUpdate(nextProps) {
    this.validChildren = this.checkChildren(nextProps.children);
    this.isManaged = this.checkIsManaged(nextProps);
    // don't bother updating if user changed the children to be invalid
    return this.validChildren;
  }

  /* get the show state */
  get show() {
    return this.isManaged ? this.state.show : this.props.show;
  }

  /*  Checks children to find the target component instance
      We only grab the first one found. Any other ones after that will be invalid, so we ignore them.
  */
  getTargetComponent(children) {
    let comp = null;
    React.Children.forEach(children, child => {
      if (!comp && child.type && child.type.className === Target.className) {
        comp = child;
      }
    });
    return comp;
  }

  /*  Checks children to find the content component instance
      We only grab the first one found. Any other ones after that will be invalid, so we ignore them.
  */
  getContentComponent(children) {
    let comp = null;
    React.Children.forEach(children, child => {
      if (!comp && child.type && child.type.className === Content.className) {
        comp = child;
      }
    });
    return comp;
  }

  /*  logs an error if children are invalid and returns valid state */
  checkChildren(children) {
    const valid = this.getTargetComponent(children) && this.getContentComponent(children);

    if (!valid) {
      console.error('Popper must contain one Target component and one Content component.');
    }

    return valid;
  }

  /* see if popper is managed or controlled based on given props */
  checkIsManaged(props) {
    return typeof props.show === 'undefined' || props.show === null;
  }

  /*  our target and content children must be internally modified in order for our queueing and binding
      to work properly. This adds those internal props to the children
  */
  modifyChildren(children) {
    return React.Children.map(children, child => {
      let newProps = {};
      if (child.type.className === Target.className) {
        newProps = {
          _onClick: this.onTargetClick,
          _targetRef: this.setTargetRef,
        };
      } else if (child.type.className === Content.className) {
        newProps = {
          _portalRoot: this.props.portalRoot,
          _usePortal: this.props.usePortal,
          _show: this.show,
          _targetRef: this.state.targetRef,
          _onComponentWillDestroy: this.onContentWillDestroy,
          _onOutsideClick: this.onContentOutsideClick,
          _queue: this.props.groupName,
        };
      }
      return React.cloneElement(child, newProps);
    });
  }

  /*  tracks the element ref to the target. This is used to bind popperjs to the target, but also to trigger a
      re-render when this is available so the content can initialize properly
  */
  setTargetRef = (el) => {
    if (!el) {
      return;
    }
    if (el === this.state.targetRef) {
      return;
    }
    this.setState({
      targetRef: el,
    });
  }

  /* 'nuff said */
  closeContent = () => {
    this.setState({
      show: false,
    });
  }

  /* if managed, this will set the show state accordingly */
  onTargetClick = () => {
    if (this.isManaged) {
      this.setState(prevState => ({
        show: this.props.targetToggle ? !prevState.show : true,
      }));
    }
  }

  /*  when we click outside the content, we need to handle that event accordingly */
  onContentOutsideClick = (contentInstance, e) => {
    // if the clicked thing contains our target, we don't bother doing anything, since onTargetClick handles that
    if (!this.state.targetRef || !this.state.targetRef.contains(e.target)) {
      // convenience function in case the user needs it for whatever reason
      if (this.props.onOutsideClick) {
        this.props.onOutsideClick(contentInstance, e);
      }
      // if we're managing the content, we get to control the queue, based on given props
      if (this.isManaged && this.props.closeOnOutsideClick) {
        switch (this.props.outsideClickType) {
          case 'group': Queue.destroyQueue(this.props.groupName); break;
          case 'all': Queue.destroyQueue(true); break;
          default: Queue._destroyLast(contentInstance, this.props.groupName);
        }
      }
    }
  }

  /*  if something this going to trigger the content to be destroyed (like killing it in the queue), we need to
      sync that here, or provide that event to the user
  */
  onContentWillDestroy = () => {
    if (this.isManaged) {
      this.closeContent();
    } else if (this.props.onPopperWillClose) {
      this.props.onPopperWillClose();
    }
  }

  render() {
    if (!this.validChildren) {
      return null;
    }

    const { children } = this.props;

    return (
      <>
        {this.modifyChildren(this.getTargetComponent(children))}
        {this.modifyChildren(this.getContentComponent(children))}
      </>
    );
  }
}

// see docs for definitions of each prop here
Popper.propTypes = {
  closeOnOutsideClick: PropTypes.bool,
  groupName: PropTypes.string,
  initiallyOpen: PropTypes.bool,
  onOutsideClick: PropTypes.func,
  onPopperWillClose: PropTypes.func,
  outsideClickType: PropTypes.oneOf(['default', 'group', 'all']),
  portalRoot: PropTypes.element,
  show: PropTypes.bool,
  targetToggle: PropTypes.bool,
  usePortal: PropTypes.bool,
};
Popper.defaultProps = {
  closeOnOutsideClick: false,
  groupName: 'global',
  initiallyOpen: false,
  onOutsideClick: (e) => {},
  onPopperWillClose: () => {},
  outsideClickType: 'default',
  portalRoot: null,
  show: null,
  targetToggle: false,
  usePortal: true,
};
