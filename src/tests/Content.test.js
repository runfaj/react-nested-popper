import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import $ from 'jquery';

import Content from '../Content';

describe('Content component', () => {
  let props;
  const map = {};
  document.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });

  beforeEach(() => {
    props = {
      _targetRef: document.createElement('div'),
      _onOutsideClick: jest.fn(),
      
    };
  });

  it('renders null without target or _show', () => {
    const component = renderer.create(
      <Content />
    );
    expect(component.toJSON()).toBeNull();

    const component2 = renderer.create(
      <Content _targetRef={props._targetRef} />
    );
    expect(component2.toJSON()).toBeNull();
  });

  it('renders', () => {
    const component = mount(
      <Content _targetRef={props._targetRef} _show>
        <div id="inner">react-nested-popper</div>
      </Content>
    );
    expect(component.find('#inner').text()).toBe('react-nested-popper');
  });

  it('renders arrow', () => {
    const component = mount(
      <Content _targetRef={props._targetRef} _show includeArrow arrowClassName="arrow">
        react-nested-popper
      </Content>
    );
    expect(component.find('.arrow').exists()).toBe(true);
  });

  it('renders portal and no-portal', () => {
    const componentWithPortal = mount(
      <Content _targetRef={props._targetRef} _show portalClassName="portal">
        react-nested-popper
      </Content>
    );
    const componentNoPortal = mount(
      <Content _targetRef={props._targetRef} _show _usePortal={false} portalClassName="portal">
        react-nested-popper
      </Content>
    );
    expect(componentWithPortal.find('.portal').exists()).toBe(true);
    expect(componentNoPortal.find('.portal').exists()).toBe(false);
  });

  it('inits popperjs binding', () => {
    const component = mount(
      <Content _targetRef={props._targetRef} _show>
        <div id="inner">react-nested-popper</div>
      </Content>
    );
    expect(component.instance().popperInstance).not.toBeNull();
  });

  it('removes popperjs when not showing', () => {
    const component = mount(
      <Content _targetRef={props._targetRef} _show>
        <div id="inner">react-nested-popper</div>
      </Content>
    );
    expect(component.instance().popperInstance).not.toBeNull();
    component.setProps({ _show: false });
    expect(component.instance().popperInstance).toBeNull();
  });

  it('calls outside click appropriately', () => {
    const component = mount(
      <Content _targetRef={props._targetRef} _show _onOutsideClick={props._onOutsideClick}>
        <div id="inner">react-nested-popper</div>
      </Content>
    );

    // click on content shouldn't call it
    $('#inner').click();
    expect(props._onOutsideClick).toHaveBeenCalledTimes(0);

    // click outside content should call it
    map.click({
      target: props._targetRef,
    });
    expect(props._onOutsideClick).toHaveBeenCalledTimes(1);
  });
});
