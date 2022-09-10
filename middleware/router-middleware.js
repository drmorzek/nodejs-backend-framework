const compose = require('../lib/compose')

const METHODS = [
	'get', 
	'post', 
	'put', 
	'delete'
]

module.exports = class Router {

	constructor() {
		this.routes = {}
		for (const method of METHODS) {
			this[method] = (path, ...middleware) => {
				const fns = compose(middleware)
				if (!this.routes[path]) {
					this.routes[path] = {}
				}
				this.routes[path][method] = fns				
			}
		}		
	}

	#find(path, routes) {
        let pattern = new RegExp('\{(.*)\}');
        for (let route in routes) {
            if (route.match(pattern)) {
                route = route.split('/'), path = path.split('/');
                if (route.length === path.length) {
                    let parameters = {};
                    for (let i = 0; i < route.length; i++) {
                        if (route[i].match(pattern)) {
                            parameters[route[i].match(pattern).pop()] = path[i];
                        } else if (route[i] === path[i]) {
                            continue;
                        } else {
                            break;
                        }
                    }
                    if (Object.keys(parameters).length) {
                        return {
                            route: routes[route.join('/')],
                            data: parameters
                        }
                    }
                }
            } else if (path === route) {
                return {
                    route: routes[route]
                }
            }
        }
        return false;
    }

	Middleware() {
		return (ctx, next) => {
			const { path, method } = ctx

			let { route, data} = this.#find(path, this.routes)
			console.log(route, path, method)

			if (!!data) {
				ctx.params = data
			}

			if (!route) {
				ctx.body = { message: 'Not Found' }
				ctx.status = 404
				return Promise.resolve()
			}
			if (!route[method]) {
				ctx.body = { message: 'Method not supported' }
				ctx.status = 405
				return Promise.resolve()
			}
			return route[method](ctx, next)
		}
	}
}
