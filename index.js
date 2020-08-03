import React, { useContext, useEffect, useState } from 'react';
import { check_deps } from './checkers';

function getProps(store, deps, componentName) {
	const props = {
		dispatch: (...x) => store.dispatch(...x, componentName),
	};

	if (deps) for (const dep of deps) props[dep] = store.state[dep];
	return props;
}

let StoreContext = React.createContext();

export const Provider = ({ children, store }) =>
	React.createElement(StoreContext.Provider, { value: { store } }, children);

export const useStore = deps => {
	const { store } = useContext(StoreContext);
	check_deps(store.state, deps, useStore.caller.name);
	const [props, setProps] = useState(getProps(store, deps, useStore.caller.name));

	useEffect(() => {
		const listener = info => {
			if (deps) {
				let shouldUpdate = false;
				for (const dep of deps) {
					if (dep in info.updatedSlices) {
						shouldUpdate = true;
						break;
					}
				}
				const compName = () => useStore.caller.name;
				if (shouldUpdate) setProps(getProps(store, deps, compName));
			}
		};

		return store.subscribe(listener); // return cleanup
	}, []);

	return props;
};

export const useStatics = () => {
	const { store } = useContext(StoreContext);
	return store.statics;
};
