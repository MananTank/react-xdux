const INVALID_SLICE_NAME = (dep, compName) => {
	console.trace();
	throw new Error(
		`Asking for invalid slice "${dep}" in the useStore hook in <${compName}/> \n` +
			`No such slice exists in the store.`
	);
};

export const check_deps = (state, deps, compName) => {
	if (deps && deps.length) {
		for (const dep of deps) {
			if (!(dep in state)) INVALID_SLICE_NAME(dep, compName);
		}
	}
};

export function whoCalledMe() {
	try {
		throw new Error();
	} catch (e) {
		try {
			return e.stack.split('at ')[3].split(' ')[0];
		} catch (e) {
			return '';
		}
	}
}

export function getProps(store, deps, componentName) {
	const props = {
		dispatch: (...x) => store.dispatch(...x, componentName),
	};

	if (deps) for (const dep of deps) props[dep] = store.state[dep];
	return props;
}
