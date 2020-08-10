import React, { useContext, useEffect, useState } from 'react'
import { checkSliceNames, getSliceStates, invalidActionError } from './helpers'

const StoreContext = React.createContext()

// accepts one or more sliceNames
// returns their values from store
// re-renders component when state changes
export const useSlice = (...sliceNames) => {
  const { store } = useContext(StoreContext)
  const initSliceStates = getSliceStates(store.state, sliceNames)
  const [sliceStates, setSliceStates] = useState(initSliceStates)

  const listener = mutation => {
    let shouldUpdate = false
    for (const sliceName of sliceNames) {
      if (sliceName in mutation.updatedSlices) {
        shouldUpdate = true
        break
      }
    }

    const newSliceStates = getSliceStates(store.state, sliceNames)
    if (shouldUpdate) setSliceStates(newSliceStates)
  }

  // subscribe to store for state change, return unsubscribe as cleanup
  useEffect(() => store.subscribe(listener), [])

  // check if sliceNames are valid
  checkSliceNames(store.state, sliceNames)

  return sliceStates.length > 1 ? sliceStates : sliceStates[0]
}

// accepts one or more constant names, returns their value from store
export const useConst = (...constantNames) => {
  const { store } = useContext(StoreContext)
  const constants = constantNames.map(c => {
    const constant = store.constants[c]
    if (!(c in store.constants)) throw new Error('invalid constant', c, 'used in useConst')
    return constant
  })
  return constants.length > 1 ? constants : constants[0]
}

// accepts name of an action and returns a dispatcher for that action
// returned function is a memoized function (stable), so no need to memoize it further in components
export const useAction = (actionType) => {
  const { store } = useContext(StoreContext)
  if (!(actionType in store.dispatchers)) invalidActionError(actionType)
  return store.dispatchers[actionType]
}

// returns store
export const useStore = () => useContext(StoreContext).store

// returns store's dispatch method
export const useDispatch = () => useContext(StoreContext).store.dispatch

// returns a react component which injects store via context
export const Provider = ({ children, store }) =>
  React.createElement(StoreContext.Provider, { value: { store } }, children)
