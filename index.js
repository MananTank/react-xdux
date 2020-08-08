import React, { useContext, useEffect, useState } from 'react'
import { checkDepsValidity, whoCalledMe, getSliceStates } from './helpers'

const StoreContext = React.createContext()

export const Provider = ({ children, store }) =>
  React.createElement(StoreContext.Provider, { value: { store } }, children)

// --------------------------------------------

export const useSlice = (...deps) => {
  const { store } = useContext(StoreContext)
  const component = whoCalledMe() // needs improvement ?
  const initialSliceStates = getSliceStates(store, deps, component)
  const [sliceStates, setSliceStates] = useState(initialSliceStates)

  // subscribe for updates
  // return unscubscribe as cleanup
  useEffect(() => {
    if (deps && deps.length) return store.subscribe(listener) // return unsubscirbe as cleanup
    // eslint-disable-next-line
  }, []);

  // check validity only once
  // add to usage only once
  if (!store.componentUsage[component]) {
    checkDepsValidity(store.state, deps, component)
    deps.forEach(sliceName => store.addSliceUsage(component, sliceName))
  }

  const listener = mutation => {
    let shouldUpdate = false
    for (const dep of deps) {
      if (dep in mutation.updatedSlices) {
        shouldUpdate = true
        break
      }
    }

    const newSliceStates = getSliceStates(store, deps, component)
    if (shouldUpdate) setSliceStates(newSliceStates)
  }

  return sliceStates.length > 1 ? sliceStates : sliceStates[0]
}

// --------------------------------------------

export const useConst = (...constantNames) => {
  const { store } = useContext(StoreContext)
  const component = whoCalledMe() // needs improvement ?
  store.addConstUsage(component, constantNames)
  const { constants } = store.componentUsage[component]
  return constants.length > 1 ? constants : constants[0]
}

// --------------------------------------------

export const useStore = () => {
  const { store } = useContext(StoreContext)
  return store
}

// --------------------------------------------

// returns a stable ('memoized') dispatch function with actionType already set as the first argument
// just call the returned function with actionData
export const useAction = (...actionTypes) => {
  const component = whoCalledMe() // needs improvement ???
  const { store } = useContext(StoreContext)
  store.addActionTypeUsage(component, actionTypes)
  const { dispatchers } = store.componentUsage[component]
  return dispatchers.length > 1 ? dispatchers : dispatchers[0]
}

export const useDispatch = () => {
  const { store } = useContext(StoreContext)
  return store.dispatch
}

// --------------------------------------------
