// return the component name the function is called from
// x is the level at which function is called from inside the component

// CompX -> f() -> trace() === 'CompX'
// CompX -> f1() -> f2() -> trace(1) === 'CompX'

const trace = (x = 0) => {
  try {
    throw new Error()
  } catch (e) {
    try {
      const origin = e.stack.split('at ')[3 + x].split(' ')[0]
      if (origin.startsWith('http')) {
        return null
      }

      return origin
    } catch (e2) {
      return null
    }
  }
}

export default trace
