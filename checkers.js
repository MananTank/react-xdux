const INVALID_DEP_ERROR = (dep, compName) => {
	throw new Error(
		`Invalid Dependency: "${dep}" provided for "${compName}" Component\n` +
			`No such data item exists in state of store.`
	);
};

const PROP_NAME_COLLISION = (dep, compName) => {
	throw new Error(
		`Prop Name Collision : "${dep}" is given as a prop to ${compName} component from both store and its parent component\n\n` +
			'Change the prop name in parent to fix the collision\n\n'
	);
};

export const check_deps = (state, deps, compName) => {
	if (deps && deps.length) {
		for (const dep of deps) {
			if (!(dep in state)) INVALID_DEP_ERROR(dep, compName);
		}
	}
};

export const check_prop_collision = (deps, props, compName) => {
	if (!props || !deps) return;
	let propsArr = Object.keys(props);

	for (const dep of deps) {
		if (propsArr.includes(dep)) PROP_NAME_COLLISION(dep, compName);
	}
};
