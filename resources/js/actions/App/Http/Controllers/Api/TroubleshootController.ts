import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TroubleshootController::index
 * @see app/Http/Controllers/Api/TroubleshootController.php:14
 * @route '/api/troubleshoot'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/troubleshoot',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TroubleshootController::index
 * @see app/Http/Controllers/Api/TroubleshootController.php:14
 * @route '/api/troubleshoot'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TroubleshootController::index
 * @see app/Http/Controllers/Api/TroubleshootController.php:14
 * @route '/api/troubleshoot'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TroubleshootController::index
 * @see app/Http/Controllers/Api/TroubleshootController.php:14
 * @route '/api/troubleshoot'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TroubleshootController::index
 * @see app/Http/Controllers/Api/TroubleshootController.php:14
 * @route '/api/troubleshoot'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TroubleshootController::index
 * @see app/Http/Controllers/Api/TroubleshootController.php:14
 * @route '/api/troubleshoot'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TroubleshootController::index
 * @see app/Http/Controllers/Api/TroubleshootController.php:14
 * @route '/api/troubleshoot'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Api\TroubleshootController::store
 * @see app/Http/Controllers/Api/TroubleshootController.php:26
 * @route '/api/troubleshoot'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/troubleshoot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TroubleshootController::store
 * @see app/Http/Controllers/Api/TroubleshootController.php:26
 * @route '/api/troubleshoot'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TroubleshootController::store
 * @see app/Http/Controllers/Api/TroubleshootController.php:26
 * @route '/api/troubleshoot'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TroubleshootController::store
 * @see app/Http/Controllers/Api/TroubleshootController.php:26
 * @route '/api/troubleshoot'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TroubleshootController::store
 * @see app/Http/Controllers/Api/TroubleshootController.php:26
 * @route '/api/troubleshoot'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\TroubleshootController::update
 * @see app/Http/Controllers/Api/TroubleshootController.php:77
 * @route '/api/troubleshoot/{document}'
 */
export const update = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/troubleshoot/{document}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\TroubleshootController::update
 * @see app/Http/Controllers/Api/TroubleshootController.php:77
 * @route '/api/troubleshoot/{document}'
 */
update.url = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return update.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TroubleshootController::update
 * @see app/Http/Controllers/Api/TroubleshootController.php:77
 * @route '/api/troubleshoot/{document}'
 */
update.patch = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\TroubleshootController::update
 * @see app/Http/Controllers/Api/TroubleshootController.php:77
 * @route '/api/troubleshoot/{document}'
 */
    const updateForm = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TroubleshootController::update
 * @see app/Http/Controllers/Api/TroubleshootController.php:77
 * @route '/api/troubleshoot/{document}'
 */
        updateForm.patch = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Api\TroubleshootController::destroy
 * @see app/Http/Controllers/Api/TroubleshootController.php:100
 * @route '/api/troubleshoot/{document}'
 */
export const destroy = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/troubleshoot/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TroubleshootController::destroy
 * @see app/Http/Controllers/Api/TroubleshootController.php:100
 * @route '/api/troubleshoot/{document}'
 */
destroy.url = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TroubleshootController::destroy
 * @see app/Http/Controllers/Api/TroubleshootController.php:100
 * @route '/api/troubleshoot/{document}'
 */
destroy.delete = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\TroubleshootController::destroy
 * @see app/Http/Controllers/Api/TroubleshootController.php:100
 * @route '/api/troubleshoot/{document}'
 */
    const destroyForm = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TroubleshootController::destroy
 * @see app/Http/Controllers/Api/TroubleshootController.php:100
 * @route '/api/troubleshoot/{document}'
 */
        destroyForm.delete = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Api\TroubleshootController::download
 * @see app/Http/Controllers/Api/TroubleshootController.php:118
 * @route '/api/troubleshoot/{document}/download'
 */
export const download = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/troubleshoot/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TroubleshootController::download
 * @see app/Http/Controllers/Api/TroubleshootController.php:118
 * @route '/api/troubleshoot/{document}/download'
 */
download.url = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return download.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TroubleshootController::download
 * @see app/Http/Controllers/Api/TroubleshootController.php:118
 * @route '/api/troubleshoot/{document}/download'
 */
download.get = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TroubleshootController::download
 * @see app/Http/Controllers/Api/TroubleshootController.php:118
 * @route '/api/troubleshoot/{document}/download'
 */
download.head = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TroubleshootController::download
 * @see app/Http/Controllers/Api/TroubleshootController.php:118
 * @route '/api/troubleshoot/{document}/download'
 */
    const downloadForm = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TroubleshootController::download
 * @see app/Http/Controllers/Api/TroubleshootController.php:118
 * @route '/api/troubleshoot/{document}/download'
 */
        downloadForm.get = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TroubleshootController::download
 * @see app/Http/Controllers/Api/TroubleshootController.php:118
 * @route '/api/troubleshoot/{document}/download'
 */
        downloadForm.head = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\Api\TroubleshootController::view
 * @see app/Http/Controllers/Api/TroubleshootController.php:132
 * @route '/api/troubleshoot/{document}/view'
 */
export const view = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/api/troubleshoot/{document}/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TroubleshootController::view
 * @see app/Http/Controllers/Api/TroubleshootController.php:132
 * @route '/api/troubleshoot/{document}/view'
 */
view.url = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return view.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TroubleshootController::view
 * @see app/Http/Controllers/Api/TroubleshootController.php:132
 * @route '/api/troubleshoot/{document}/view'
 */
view.get = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TroubleshootController::view
 * @see app/Http/Controllers/Api/TroubleshootController.php:132
 * @route '/api/troubleshoot/{document}/view'
 */
view.head = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TroubleshootController::view
 * @see app/Http/Controllers/Api/TroubleshootController.php:132
 * @route '/api/troubleshoot/{document}/view'
 */
    const viewForm = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TroubleshootController::view
 * @see app/Http/Controllers/Api/TroubleshootController.php:132
 * @route '/api/troubleshoot/{document}/view'
 */
        viewForm.get = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TroubleshootController::view
 * @see app/Http/Controllers/Api/TroubleshootController.php:132
 * @route '/api/troubleshoot/{document}/view'
 */
        viewForm.head = (args: { document: number | { id: number } } | [document: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
const TroubleshootController = { index, store, update, destroy, download, view }

export default TroubleshootController