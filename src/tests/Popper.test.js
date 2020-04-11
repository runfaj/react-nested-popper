import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Target from '../Target';
import Content from '../Content';
import Popper from '../Popper';

import Stack from '../Stack';
jest.mock('../Stack');

describe('Popper component', () => {
  console.error = jest.fn();

  let targetEl, contentEl;
  beforeEach(() => {
    targetEl = <div id="target">react-nested-popper</div>;
    contentEl = <div id="content">react-nested-popper</div>;
  });

  it('renders with valid children', () => {
    const component = renderer.create(
      <Popper>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('doesn\'t render with invalid children', () => {
    const component = renderer.create(
      <Popper>
        <Target>{targetEl}</Target>
      </Popper>
    );
    expect(component.toJSON()).toBeNull();

    const component2 = renderer.create(
      <Popper>
        <Content>{contentEl}</Content>
      </Popper>
    );
    expect(component2.toJSON()).toBeNull();
  });

  it('managed vs controlled set via show prop', () => {
    const managed = mount(
      <Popper>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    
    const controlled = mount(
      <Popper show>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );

    expect(managed.instance().isManaged).toBe(true);
    expect(controlled.instance().isManaged).toBe(false);
  });

  it('target ref is set appropriately', () => {
    const component = mount(
      <Popper>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );

    expect(component.instance().state.targetRef).not.toBeNull();
  });

  it('onTargetClick checks', () => {
    const nonToggle = mount(
      <Popper>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    const toggle = mount(
      <Popper targetToggle>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );

    const onControlledClick = jest.fn();
    const controlled = mount(
      <Popper show onTargetClick={onControlledClick}>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    
    // non-toggled state becomes show and only show
    nonToggle.instance().onTargetClick();
    expect(nonToggle.instance().state.show).toBe(true);
    nonToggle.instance().onTargetClick();
    expect(nonToggle.instance().state.show).toBe(true);
    expect(onControlledClick).toHaveBeenCalledTimes(0);

    // toggled instance, state should toggle
    toggle.instance().onTargetClick();
    expect(toggle.instance().state.show).toBe(true);
    toggle.instance().onTargetClick();
    expect(toggle.instance().state.show).toBe(false);
    expect(onControlledClick).toHaveBeenCalledTimes(0);

    // controlled instance, onTargetClick should fire
    controlled.instance().onTargetClick('event');
    expect(onControlledClick).toHaveBeenCalledWith('event');
  });

  it('closeContent checks', () => {
    const component = mount(
      <Popper>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );

    component.setState({ show: true });
    component.instance().closeContent();
    expect(component.instance().state.show).toBe(false);
  });

  it('onContentWillDestroy checks', () => {
    const onPopperWillClose = jest.fn();
    const managed = mount(
      <Popper onPopperWillClose={onPopperWillClose}>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    const controlled = mount(
      <Popper show onPopperWillClose={onPopperWillClose}>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );

    managed.setState({ show: true });
    managed.instance().onContentWillDestroy();
    expect(managed.instance().state.show).toBe(false);
    expect(onPopperWillClose).toHaveBeenCalledTimes(0);

    controlled.instance().onContentWillDestroy();
    expect(onPopperWillClose).toHaveBeenCalledTimes(1);
  });

  it('onContentOutsideClick checks', () => {
    const contentInstance = { foo: 'bar' };
    const e = {
      target: document.createElement('div'),
    };
    const onOutsideClick = jest.fn();

    const noClose = mount(
      <Popper onOutsideClick={onOutsideClick}>
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    const closeDefault = mount(
      <Popper
        onOutsideClick={onOutsideClick}
        closeOnOutsideClick
        outsideClickType="default"
        groupName="global"
      >
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    const closeAll = mount(
      <Popper
        onOutsideClick={onOutsideClick}
        closeOnOutsideClick
        outsideClickType="all"
        groupName="global"
      >
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );
    const closeGroup = mount(
      <Popper
        onOutsideClick={onOutsideClick}
        closeOnOutsideClick
        outsideClickType="group"
        groupName="global"
      >
        <Target>{targetEl}</Target>
        <Content>{contentEl}</Content>
      </Popper>
    );

    noClose.instance().onContentOutsideClick(contentInstance, e);
    expect(onOutsideClick).toHaveBeenCalledWith(contentInstance, e);
    expect(Stack._destroyLast).not.toHaveBeenCalled();

    closeDefault.instance().onContentOutsideClick(contentInstance, e);
    expect(Stack._destroyLast).toHaveBeenCalledWith(contentInstance, 'global');

    closeAll.instance().onContentOutsideClick(contentInstance, e);
    expect(Stack.destroyStack).toHaveBeenCalledWith(true);

    closeGroup.instance().onContentOutsideClick(contentInstance, e);
    expect(Stack.destroyStack).toHaveBeenCalledWith('global');
  });
});
