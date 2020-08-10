import { useContext } from 'react'
import StoreContext from '../utils/Context'
import trace from '../utils/trace'

const invalidActionError = (action) => {
  if (process.env.NODE_ENV !== 'production') {
    const component = `< ${trace(1)} />`
    const extraInfo = component !== null ? `in ${component}` : ''
    throw new Error(`invalid action "${action}" used in useAction() ${extraInfo}`)
  }
}

const useAction = (action) => {
  const { store } = useContext(StoreContext)
  if (!(action in store.dispatchers)) invalidActionError(action)
  return store.dispatchers[action]
}

export default useAction
