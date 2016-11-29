import React from 'react';
import { shallow } from 'enzyme';
import Organization from './Organization';

function setup(moreProps) {
  const props = {
    onRetry: jest.fn(),
    params: {},
    ...moreProps
  }

  const wrapper = shallow(<Organization {...props} />)

  return {
    props,
    wrapper
  }
}

describe('Organization', () => {
  it('renders', () => {
    const { wrapper } = setup()
    expect(wrapper).toBeDefined()
  })
  it('renders loading', () => {
    const { wrapper } = setup({
      loading: true
    })
    expect(wrapper.find('CircularProgress').length).toBe(1)
  })
  it('renders error', () => {
    const { wrapper } = setup({
      error: true
    })
    expect(wrapper.find('Retryer').length).toBe(1)
  })
  it('renders org', () => {
    const { wrapper } = setup({
      org: {
        name: 'Foo Org'
      }
    })
    expect(wrapper.debug()).toMatch(/Foo Org/)
  })
  it('calls onRetry', () => {
    const { wrapper, props } = setup({
      error: true
    })
    const retryer = wrapper.find('Retryer')
    retryer.props().retry()
    expect(props.onRetry.mock.calls.length).toBe(1)
    expect(props.onRetry).toBeCalled();
  })
})
