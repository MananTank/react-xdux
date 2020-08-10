import React from 'react'

const StoreContext = React.createContext(null)

if (process.env.NODE_ENV !== 'production') {
  StoreContext.displayName = 'ReactXedux' // to show context name in react devtools
}

export default StoreContext
