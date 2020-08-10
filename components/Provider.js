import React from 'react'
import StoreContext from '../utils/Context'
import PropTypes from 'prop-types'

const Provider = ({ children, store }) =>
  React.createElement(StoreContext.Provider, { value: { store } }, children)

if (process.env.NODE_ENV !== 'production') {
  Provider.propTypes = {
    store: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired
  }
}

export default Provider
