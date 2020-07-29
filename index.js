import React from 'react';
import { check_deps, check_prop_collision } from './checkers';

let StoreContext = React.createContext();

// -----------------------------------------
class Provider extends React.Component {
	render() {
		return React.createElement(
			StoreContext.Provider,
			{ value: { store: this.props.store } },
			this.props.children
		);
	}
}

// -----------------------------------------
const connect = (Comp, deps) => {
	const hasDeps = deps && deps.length;

	return class ConnectedComponent extends React.Component {
		static contextType = StoreContext;

		componentDidMount() {
			check_deps(this.context.store.state, deps, Comp.name);
			check_prop_collision(deps, this.props, Comp.name);

			if (hasDeps) {
				const listener = key => {
					if (deps.includes(key)) this.forceUpdate();
				};

				this.unsubscribe = this.context.store.subscribe(listener);
			}
		}

		componentWillUnmount() {
			if (hasDeps) this.unsubscribe();
		}

		render() {
			const props = {
				...this.props,
				dispatch: this.context.store.dispatch,
			};
			if (hasDeps) deps.forEach(d => (props[d] = this.context.store.state[d]));
			return React.createElement(Comp, props);
		}
	};
};

export { Provider, connect };
