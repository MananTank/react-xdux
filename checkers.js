const INVALID_SLICE_NAME = (dep, compName) => {
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
