import updeep from 'updeep'

export function promiseFetcher(properteer, promiseCreator, dataShaper) {
  return (props) => {
    let property
    if (typeof properteer === 'function') property = properteer(props)
    else property = properteer
    const { request, fail, succeed } = bind(property)
    props.dispatch(request())
    promiseCreator(props)
        .then(data => {
          if (dataShaper) data = dataShaper(props, data)
          else data = {[property]: data}
          props.dispatch(succeed(data))
        })
        .catch(err => {
          props.dispatch(fail(err))
        })
  }
}

export function fetchProps(property, state) {
  return {
    error: state && state.fetch && state.fetch.errors && state.fetch.errors[property],
    loading: state && state.fetch && state.fetch.requests && state.fetch.requests[property]
  }
}

export function stop(props) {
  const { loading, error } = props
  return loading || error
}

export function action(property, phase, payload, error) {
  return {
    type: 'FETCH',
    meta: {
      phase,
      property
    },
    payload,
    error
  }
}

export function bind(property) {
  return {
    request: request.bind(null, property),
    succeed: succeed.bind(null, property),
    fail: fail.bind(null, property),
  }
}

export function reset(property) {
  return action(property, 'RESET')
}

export function request(property) {
  return action(property, 'REQUEST')
}

export function succeed(property, payload) {
  return action(property, 'SUCCESS', payload)
}

export function fail(property, payload) {
  payload = payload == null ? true : payload
  return action(property, 'FAILURE', payload, true)
}

export function fetchReducer(state = {}, action) {
  switch(action.type) {
  case 'FETCH':
    return handleFetch(state, action)
  default:
    return state
  }
}

export function handleFetch(state = {}, action) {
  if (action.meta.phase === 'REQUEST') {
    return {
      ...state,
        // [action.meta.property]: null,
      fetch: {
        ...state.fetch,
        requests: {
          ...state.fetch && state.fetch.requests,
          [action.meta.property]: true
        },
        errors: {
          ...state.fetch && state.fetch.errors,
          [action.meta.property]: null
        }
      }
    }
  }
  else if (action.meta.phase === 'SUCCESS') {
    return updeep(action.payload, {
      ...state,
      fetch: {
        ...state.fetch,
        requests: {
          ...state.fetch && state.fetch.requests,
          [action.meta.property]: false
        },
      }
    })
  }
  else if (action.meta.phase === 'FAILURE') {
    return {
      ...state,
      fetch: {
        ...state.fetch,
        requests: {
          ...state.fetch && state.fetch.requests,
          [action.meta.property]: false
        },
        errors: {
          ...state.fetch && state.fetch.errors,
          [action.meta.property]: action.payload
        }
      }
    }
  }
  else if (action.meta.phase === 'RESET') {
    return {
      ...state,
      fetch: {
        ...state.fetch,
        requests: {
          ...state.fetch && state.fetch.requests,
          [action.meta.property]: null
        },
        errors: {
          ...state.fetch && state.fetch.errors,
          [action.meta.property]: null
        }
      }
    }
  }
  return state
}
