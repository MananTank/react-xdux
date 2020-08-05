import React, { useContext, useEffect, useState } from 'react'
import { checkDepsValidity, whoCalledMe, getProps } from './helpers'

const StoreContext = React.createContext()

// eslint-disable-next-line react/prop-types
export const Provider = ({ children, store }) =>
  React.createElement(StoreContext.Provider, { value: { store } }, children)

export const useStore = deps => {
  const { store } = useContext(StoreContext)
  const componentName = whoCalledMe()

  checkDepsValidity(store.state, deps, componentName)
  const [props, setProps] = useState(getProps(store, deps, componentName))

  useEffect(() => {
    const listener = info => {
      if (deps) {
        let shouldUpdate = false
        for (const dep of deps) {
          if (dep in info.updatedSlices) {
            shouldUpdate = true
            break
          }
        }

        if (shouldUpdate) setProps(getProps(store, deps, componentName))
      }
    }

    return store.subscribe(listener) // return cleanup
    // eslint-disable-next-line
	}, []);

  return props
}

export const useStatics = () => {
  const { store } = useContext(StoreContext)
  return store.statics
}

export const useFullStore = () => {
  const { store } = useContext(StoreContext)
  return store
}
