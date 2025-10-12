import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults, validateParameters } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/login'
 */
const indexb6041c76e8e1cd791f8f89d035d48611 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
})

indexb6041c76e8e1cd791f8f89d035d48611.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/login'
 */
indexb6041c76e8e1cd791f8f89d035d48611.url = (options?: RouteQueryOptions) => {
    return indexb6041c76e8e1cd791f8f89d035d48611.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/login'
 */
indexb6041c76e8e1cd791f8f89d035d48611.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/login'
 */
indexb6041c76e8e1cd791f8f89d035d48611.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexb6041c76e8e1cd791f8f89d035d48611.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/login'
 */
    const indexb6041c76e8e1cd791f8f89d035d48611Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexb6041c76e8e1cd791f8f89d035d48611.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/login'
 */
        indexb6041c76e8e1cd791f8f89d035d48611Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexb6041c76e8e1cd791f8f89d035d48611.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/login'
 */
        indexb6041c76e8e1cd791f8f89d035d48611Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexb6041c76e8e1cd791f8f89d035d48611.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexb6041c76e8e1cd791f8f89d035d48611.form = indexb6041c76e8e1cd791f8f89d035d48611Form
    /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/tickets/{path?}'
 */
const index1f567f02a71e2d0221bb3092f07b36e3 = (args?: { path?: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1f567f02a71e2d0221bb3092f07b36e3.url(args, options),
    method: 'get',
})

index1f567f02a71e2d0221bb3092f07b36e3.definition = {
    methods: ["get","head"],
    url: '/tickets/{path?}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/tickets/{path?}'
 */
index1f567f02a71e2d0221bb3092f07b36e3.url = (args?: { path?: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    path: args[0],
                }
    }

    args = applyUrlDefaults(args)

    validateParameters(args, [
            "path",
        ])

    const parsedArgs = {
                        path: args?.path,
                }

    return index1f567f02a71e2d0221bb3092f07b36e3.definition.url
            .replace('{path?}', parsedArgs.path?.toString() ?? '')
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/tickets/{path?}'
 */
index1f567f02a71e2d0221bb3092f07b36e3.get = (args?: { path?: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1f567f02a71e2d0221bb3092f07b36e3.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/tickets/{path?}'
 */
index1f567f02a71e2d0221bb3092f07b36e3.head = (args?: { path?: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index1f567f02a71e2d0221bb3092f07b36e3.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/tickets/{path?}'
 */
    const index1f567f02a71e2d0221bb3092f07b36e3Form = (args?: { path?: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index1f567f02a71e2d0221bb3092f07b36e3.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/tickets/{path?}'
 */
        index1f567f02a71e2d0221bb3092f07b36e3Form.get = (args?: { path?: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1f567f02a71e2d0221bb3092f07b36e3.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/tickets/{path?}'
 */
        index1f567f02a71e2d0221bb3092f07b36e3Form.head = (args?: { path?: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index1f567f02a71e2d0221bb3092f07b36e3.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index1f567f02a71e2d0221bb3092f07b36e3.form = index1f567f02a71e2d0221bb3092f07b36e3Form
    /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/{path}'
 */
const indexe82770d06df9f3de57e12c6f4a3eb557 = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'get',
})

indexe82770d06df9f3de57e12c6f4a3eb557.definition = {
    methods: ["get","head"],
    url: '/{path}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/{path}'
 */
indexe82770d06df9f3de57e12c6f4a3eb557.url = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    path: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        path: args.path,
                }

    return indexe82770d06df9f3de57e12c6f4a3eb557.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/{path}'
 */
indexe82770d06df9f3de57e12c6f4a3eb557.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/{path}'
 */
indexe82770d06df9f3de57e12c6f4a3eb557.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexe82770d06df9f3de57e12c6f4a3eb557.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/{path}'
 */
    const indexe82770d06df9f3de57e12c6f4a3eb557Form = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexe82770d06df9f3de57e12c6f4a3eb557.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/{path}'
 */
        indexe82770d06df9f3de57e12c6f4a3eb557Form.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexe82770d06df9f3de57e12c6f4a3eb557.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\SPAController::index
 * @see app/Http/Controllers/SPAController.php:7
 * @route '/{path}'
 */
        indexe82770d06df9f3de57e12c6f4a3eb557Form.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexe82770d06df9f3de57e12c6f4a3eb557.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexe82770d06df9f3de57e12c6f4a3eb557.form = indexe82770d06df9f3de57e12c6f4a3eb557Form

export const index = {
    '/login': indexb6041c76e8e1cd791f8f89d035d48611,
    '/tickets/{path?}': index1f567f02a71e2d0221bb3092f07b36e3,
    '/{path}': indexe82770d06df9f3de57e12c6f4a3eb557,
}

const SPAController = { index }

export default SPAController