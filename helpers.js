const INVALID_SLICE_NAME = (dep, component) => {
  throw new Error(
    `Asking for invalid slice "${dep}" in the useStore hook in <${component}/> \n` +
      'No such slice exists in the store.'
  )
}

export const checkDepsValidity = (state, deps, component) => {
  if (deps && deps.length) {
    for (const dep of deps) {
      if (!(dep in state)) INVALID_SLICE_NAME(dep, component)
    }
  }
}

export function whoCalledMe () {
  try {
    throw new Error()
  } catch (e) {
    try {
      return e.stack.split('at ')[3].split(' ')[0]
    } catch (e2) {
      return ''
    }
  }
}

export const getSliceStates = (store, sliceNames) => {
  const sliceStates = []
  if (sliceNames && sliceNames.length) {
    for (const sliceName of sliceNames) {
      sliceStates.push(store.state[sliceName])
    }
  }
  return sliceStates
}
