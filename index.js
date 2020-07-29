import React from 'react';

// check if all string given in deps array are valid keys of state
const checkDepsAreValid = (store, deps, compName) => {
	if (deps && deps.length) {
		for (const d of deps) {
			if (!(d in store.state)) {
				throw new Error(
					`Invalid Dependency: "${d}" provided for "${compName}" Component\n` +
						`No such data item exists in state of store.`
				);
			}
		}
	}
};

const checkPropCollision = (deps, props, compName) => {
	if (!props || !deps) return;
	let propsArr = Object.keys(props);

	for (const d of deps) {
		if (propsArr.includes(d)) {
			throw new Error(
				`Prop Name Collision : "${d}" is given as a prop to ${compName} component from both store and its parent component\n\n` +
					'Change the prop name in parent to fix the collision\n\n'
			);
		}
	}
};

// connector takes a store and returns a connect() function
// connect function can be used to connect the react Component to store
// when a component is connected to store, it gets its desired dataItems and dispatch function as props
// connected component also re-renders when any of its deps changes in state

const connector = store => {
	// connect takes a component 'Comp' and 'deps' array
	// deps (dependencies) array is an array of strings
	// these strings are names of dataitems that the component needs ( which will be made available as props )

	// when any of the dataitem in deps changes in state, component is re-renderd
	// to achieve this, Comp is wrapped in a ConnectedComponent
	// ConnectedComponent subscribes a listener to store and re-renders when any of the deps is changed in state
	function connect(Comp, deps) {
		checkDepsAreValid(store, deps, Comp.name);

		class ConnectedComponent extends React.Component {
			componentDidMount() {
				// if the component has deps, subscribe a listener in store for this component
				if (deps && deps.length) {
					// listener is called by store with dataItem that is changed in the store
					// if changedDataItem is one of the dep, in deps, re-render the component
					const listener = changedDataItem => {
						if (deps.includes(changedDataItem)) this.forceUpdate();
					};

					// subscribe returns unsubscribe function which can be used to remove listener
					// when component unmounts, we should remove listener
					this.unsubscribe = store.subscribe(listener);
				}
			}

			// if the component has deps
			// remove listener for this component from store
			componentWillUnmount() {
				if (deps && deps.length) this.unsubscribe();
			}

			// render the Component with props added
			// these props include - all the dataItems mentioned in deps array
			// and a dispatch function - for dispatching actions
			render() {
				checkPropCollision(deps, this.props, Comp.name);
				const props = { ...this.props, dispatch: store.dispatch };
				if (deps && deps.length) deps.forEach(d => (props[d] = store.state[d]));
				return React.createElement(Comp, props);
			}
		}

		return ConnectedComponent;
	}

	return connect;
};

export default connector;
