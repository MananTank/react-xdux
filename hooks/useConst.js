import { useContext } from 'react'
import StoreContext from '../utils/Context'
import trace from '../utils/trace'

const invalidConstError = (constant, component) => {
  if (process.env.NODE_ENV !== 'production') {
    const extraInfo = component !== null ? `in < ${component} />` : ''
    throw new Error(`invalid constant "${constant}" used in useConst() ${extraInfo}`)
  }
}

const useConst = (...constantNames) => {
  const { store } = useContext(StoreContext)
  const component = trace()
  const constants = constantNames.map(c => {
    const constant = store.constants[c]
    if (!(c in store.constants)) invalidConstError(c, component)
    return constant
  })
  return constants.length > 1 ? constants : constants[0]
}

export default useConst
