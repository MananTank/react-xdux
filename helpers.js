
export function trace (x = 0) {
  try {
    throw new Error()
  } catch (e) {
    try {
      return e.stack.split('at ')[3 + x].split(' ')[0]
    } catch (e2) {
      return null
    }
  }
}

const invalidSliceNameError = (sliceName) => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
    `invalid SliceName: "${sliceName}" used in useSlice() in < ${trace(2)} />` +
      '\nNo such slice exists in the store.'
    )
  }
}

export const checkSliceNames = (state, sliceNames) => {
  for (const sliceName of sliceNames) {
    if (!(sliceName in state)) invalidSliceNameError(sliceName)
  }
}

export const invalidActionError = (actionType) => {
  if (process.env.NODE_ENV !== 'production') {
    const component = `< ${trace(1)} />`
    const extraInfo = component !== null ? `in ${component}` : ''
    throw new Error(`invalid action "${actionType}" used in useAction() ${extraInfo}`)
  }
}

export const getSliceStates = (state, sliceNames) => sliceNames.map(name => state[name])
