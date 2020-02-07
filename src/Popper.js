import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Target from './Target';
import Content from './Content';
import Queue from './Queue';

export default class Popper extends React.Component {
  static className = 'react-nested-popper_Popper';

  constructor(props) {
    super(props);

    this.validChildren = this.checkChildren(props.children);
    this.isManaged = this.checkIsManaged(props);
    this.id = _.uniqueId();

    this.state = {
      show: !!props.initiallyOpen,
      targetRef: null, // we do this in the state instead of regular this assignment because we need to re-trigger a render when this updates
    };
  }

  shouldComponentUpdate(nextProps) {
    this.validChildren = this.checkChildren(nextProps.children);
    this.isManaged = this.checkIsManaged(nextProps);
    return this.validChildren;
  }

  get show() {
    return this.isManaged ? this.state.show : this.props.show;
  }

  getTargetComponent(children) {
    let comp = null;
    React.Children.forEach(children, child => {
      if (!comp && child.type && child.type.className === Target.className) {
        comp = child;
      }
    });
    return comp;
  }

  getContentComponent(children) {
    let comp = null;
    React.Children.forEach(children, child => {
      if (!comp && child.type && child.type.className === Content.className) {
        comp = child;
      }
    });
    return comp;
  }

  checkChildren(children) {
    const valid = this.getTargetComponent(children) && this.getContentComponent(children);

    if (!valid) {
      console.error('Popper must contain one Target component and one Content component.');
    }

    return valid;
  }

  checkIsManaged(props) {
    return typeof props.show === 'undefined' || props.show === null;
  }

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
          portalRoot: this.props.portalRoot,
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

  closeContent = () => {
    this.setState({
      show: false,
    });
  }

  onTargetClick = () => {
    if (this.isManaged) {
      this.setState(prevState => ({
        show: this.props.targetToggle ? !prevState.show : true,
      }));
    }
  }

  onContentOutsideClick = (contentInstance, e) => {
    if (!this.state.targetRef || !this.state.targetRef.contains(e.target)) {
      if (this.props.onOutsideClick) {
        this.props.onOutsideClick(contentInstance, e);
      }
      if (this.isManaged && this.props.closeOnOutsideClick) {
        switch (this.props.outsideClickType) {
          case 'group': Queue.destroyQueue(this.props.groupName); break;
          case 'all': Queue.destroyQueue(true); break;
          default: Queue._destroyLast(contentInstance, this.props.groupName);
        }
      }
    }
  }

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

Popper.propTypes = {
  closeOnOutsideClick: PropTypes.bool, // if managed, need to explicitly define this. Ignored if not managed
  groupName: PropTypes.string, // this is the queue group this popper will belong to
  initiallyOpen: PropTypes.bool,
  onOutsideClick: PropTypes.func,
  onPopperWillClose: PropTypes.func,
  outsideClickType: PropTypes.oneOf(['default', 'group', 'all']),
  portalRoot: PropTypes.element, // container to attach portals to, defaults to body
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
  targetToggle: false, // true to have target act as toggle instead of only open
  usePortal: true,
};
