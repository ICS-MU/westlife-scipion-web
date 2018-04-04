const mapping = {
	'dashboard': {
		path: '/',
		regex: '\\/',
		title: 'Dashboard'
	},
	'deployment.show': {
		path: '/deployments/:id',
		regex: '\\/deployments\\/(\\d+)',
		title: 'Deployment detail',
		previous: 'dashboard'
	},
	'login': {
		path: '/login'
	}
}

export const getRoutesMapping = () => mapping

export const getRoutePath = (...args) => getRoute(...args).path

export const getRoute = (name, params = {}, prefix = '') => {
	let route = { ...mapping[name] }
	if (Object.keys(route).length === 0) {
		throw new Error(`Route with name ${name} does not exist`)
	}
	route.path = replaceParamsInPath(route.path, params)
	route.path = applyPrefixToPath(route.path, prefix)
	return route
}

export const replaceParamsInPath = (path, params = {}) => {
	const paramsKeys = Object.keys(params);
	if(!paramsKeys.length) {
		return path
	}

	paramsKeys.forEach(property => {
		const reg = new RegExp(`:${property}(?![\\w\\d])`, 'i')
		path = path.replace(reg, params[property])
	})

	return path
}

export const applyPrefixToPath = (path, prefix = '') => {
	if(!prefix.length) {
		return path
	}

	return `${prefix}${path}`;
}

export const getRoutePrevious = (pathname) => {
	const routes = Object.keys(mapping)
	let previous = undefined
	routes.forEach(property => {
		if(mapping[property].regex) {
			const regExp = new RegExp(mapping[property].regex)
			const regexGroups = regExp.exec(pathname)
			if(regexGroups) {
				previous = mapping[property].previous
			}
		}
	})
	return previous
}
