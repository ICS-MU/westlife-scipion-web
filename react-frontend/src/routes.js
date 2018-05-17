/*
 * Defined routes in application
 */
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

/*
 * Function returns application routes mapping
 *
 * @return {object}	mapping Object storing application routes
 */
export const getRoutesMapping = () => mapping

/*
 * Function returns route path based on arguments
 *
 * @param 	{string, object, string}	args	Route's name, params and prefix  
 * @return  {string} 					Route's path
 */
export const getRoutePath = (...args) => getRoute(...args).path

/*
 * Returns route based on arguments, adds prefix if specified
 *
 * @param	{string}	name	Route's name
 * @param	{object}	params	Route's params (f.e. id for 'deployment.show' route)
 * @param	{prefix}	prefix	Prefix to apply to the route's path
 * @return	{object}	Route
 */
export const getRoute = (name, params = {}, prefix = '') => {
	let route = { ...mapping[name] }
	if (Object.keys(route).length === 0) {
		throw new Error(`Route with name ${name} does not exist`)
	}
	route.path = replaceParamsInPath(route.path, params)
	route.path = applyPrefixToPath(route.path, prefix)
	return route
}

/*
 * Replaces route's path params with real ones
 *
 * @param	{string}	path	Route's path
 * @param	{object}	params	Parameters
 * @return	{string}	Path with replaced params
 */
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


/*
 * Applies prefix to the given path
 *
 * @param	{string}	path 	Route's path
 * @param	{string}	prefix	Prefix to apply
 * @return	{string}	Route's path with prefix
 */
export const applyPrefixToPath = (path, prefix = '') => {
	if(!prefix.length) {
		return path
	}

	return `${prefix}${path}`;
}

/*
 * Returns route's predecessor based on the given pathname (f.e. /deployments/24)
 *
 * @param	{string}	pathname	Route's pathname with replaced parameters (browser url format)
 * @return	{string}	Predecessor route's name
 */
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
