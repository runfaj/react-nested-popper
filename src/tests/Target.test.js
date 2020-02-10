import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import Target from '../Target';

describe('Target component', () => {
  it('renders with nested text', () => {
    const component = renderer.create(
      <Target>react-nested-popper</Target>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('renders with multiple children', () => {
    const component = renderer.create(
      <Target>
        <div>react-nested-popper</div>
        <div>react-nested-popper</div>
      </Target>,
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  it('calls both ref functions', () => {
    const setRef = jest.fn();
    const wrapper = mount(
      <Target
        innerRef={setRef}
        _targetRef={setRef}
      />
    );
    expect(setRef).toHaveBeenCalledTimes(2);
  });
});
