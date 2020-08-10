// use this only for creating devtools and stuff

import { useContext } from 'react'
import StoreContext from '../utils/Context'

const useStore = () => useContext(StoreContext).store

export default useStore
