import { useContext, useState, useEffect } from 'react'
import StoreContext from '../utils/Context'
import trace from '../utils/trace'

const invalidSliceNameError = (sliceName) => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error(
    `invalid SliceName: "${sliceName}" used in useData() in < ${trace(2)} />` +
      '\nNo such slice exists in the store.'
    )
  }
}

const checkSliceNames = (state, sliceNames) => {
  for (const sliceName of sliceNames) {
    if (!(sliceName in state)) invalidSliceNameError(sliceName)
  }
}

const useData = (...sliceNames) => {
  const { store } = useContext(StoreContext)
  checkSliceNames(store.state, sliceNames)

  const initSliceStates = sliceNames.map(name => store.state[name])
  const [sliceStates, setSliceStates] = useState(initSliceStates)

  useEffect(() =>
    store.onSliceChange(sliceNames, newStates => setSliceStates(newStates)),
  [])

  return sliceStates.length > 1 ? sliceStates : sliceStates[0]
}

export default useData
