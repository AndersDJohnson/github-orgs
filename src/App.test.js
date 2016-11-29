import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

function setup() {
  const props = {
    onOrgChange: jest.fn()
  }

  const wrapper = shallow(<App {...props} />)

  return {
    props,
    wrapper
  }
}

describe('App', () => {
  it('renders', () => {
    const { wrapper } = setup()
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.App-header').length).toBe(1)
    expect(wrapper.find('TextField').length).toBe(1)
  })
  it('does not call onOrgChange onKeyUp without enter', () => {
    const { wrapper, props } = setup()
    const input = wrapper.find('TextField')
    input.props().onKeyUp({
      keyCode: 10
    })
    expect(props.onOrgChange.mock.calls.length).toBe(0)
  })
  it('calls onOrgChange onKeyUp enter', () => {
    const { wrapper, props } = setup()
    const input = wrapper.find('TextField')
    input.props().onKeyUp({
      keyCode: 13
    })
    expect(props.onOrgChange.mock.calls.length).toBe(1)
    expect(props.onOrgChange).toBeCalledWith(undefined);
  })
  it('calls onOrgChange onKeyUp enter with state from onChange', () => {
    const { wrapper, props } = setup()
    const input = wrapper.find('TextField')
    input.props().onChange(null, 'verbose')
    input.props().onKeyUp({
      keyCode: 13
    })
    expect(props.onOrgChange.mock.calls.length).toBe(1)
    expect(props.onOrgChange).toBeCalledWith('verbose');
  })
  it('calls onOrgChange onKeyUp enter with state', () => {
    const { wrapper, props } = setup()
    const input = wrapper.find('TextField')
    wrapper.setState({ org: 'verbose' })
    input.props().onKeyUp({
      keyCode: 13
    })
    expect(props.onOrgChange.mock.calls.length).toBe(1)
    expect(props.onOrgChange).toBeCalledWith('verbose');
  })
})
