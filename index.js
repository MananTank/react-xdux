import React, { useContext, useEffect, useState } from 'react'
import { checkDepsValidity, whoCalledMe, getSliceStates } from './helpers'

const StoreContext = React.createContext()

export const Provider = ({ children, store }) =>
  React.createElement(StoreContext.Provider, { value: { store } }, children)

export const useSlice = (...deps) => {
  const { store } = useContext(StoreContext)
  const component = whoCalledMe() // needs improvement ?
  checkDepsValidity(store.state, deps, component)
  const initialSliceStates = getSliceStates(store, deps, component)
  const [sliceStates, setSliceStates] = useState(initialSliceStates)

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

  useEffect(() => {
    if (deps && deps.length) {
      return store.subscribe(listener) // return unsubscirbe as cleanup
    }

    // eslint-disable-next-line
	}, []);

  return sliceStates.length > 1 ? sliceStates : sliceStates[0]
}

export const useStatic = (...statics) => {
  const { store } = useContext(StoreContext)
  const component = whoCalledMe() // needs improvement ?
  const staticValues = []
  for (const st of statics) {
    if (!store.statics[st]) throw new Error(`Invalid static "${st}" used in useStatic() hook in <${component}/>. No such static exists in store`)
    staticValues.push(store.statics[st])
  }
  return staticValues.length > 1 ? staticValues : staticValues[0]
}

export const useFullStore = () => {
  const { store } = useContext(StoreContext)
  return store
}

export const useDispatch = (...actionTypes) => {
  const { store } = useContext(StoreContext)
  const component = whoCalledMe() // needs improvement ???
  const dispatchers = []

  for (const actionType of actionTypes) {
    if (!store.isValidActionType(actionType)) throw new Error(`Invalid action type "${actionType}" used in useDispatch hook in <${component}/>, no such action type exists`)
    const dispatcher = (actionData) => store.dispatch(actionType, actionData, { component })
    dispatchers.push(dispatcher)
  }

  return actionTypes.length > 1 ? dispatchers : dispatchers[0]
}
