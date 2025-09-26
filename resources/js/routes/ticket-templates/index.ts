import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TicketTemplateController::index
 * @see app/Http/Controllers/Api/TicketTemplateController.php:14
 * @route '/api/ticket-templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/ticket-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::index
 * @see app/Http/Controllers/Api/TicketTemplateController.php:14
 * @route '/api/ticket-templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::index
 * @see app/Http/Controllers/Api/TicketTemplateController.php:14
 * @route '/api/ticket-templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketTemplateController::index
 * @see app/Http/Controllers/Api/TicketTemplateController.php:14
 * @route '/api/ticket-templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketTemplateController::index
 * @see app/Http/Controllers/Api/TicketTemplateController.php:14
 * @route '/api/ticket-templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::index
 * @see app/Http/Controllers/Api/TicketTemplateController.php:14
 * @route '/api/ticket-templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::index
 * @see app/Http/Controllers/Api/TicketTemplateController.php:14
 * @route '/api/ticket-templates'
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
* @see \App\Http\Controllers\Api\TicketTemplateController::store
 * @see app/Http/Controllers/Api/TicketTemplateController.php:27
 * @route '/api/ticket-templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/ticket-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::store
 * @see app/Http/Controllers/Api/TicketTemplateController.php:27
 * @route '/api/ticket-templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::store
 * @see app/Http/Controllers/Api/TicketTemplateController.php:27
 * @route '/api/ticket-templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketTemplateController::store
 * @see app/Http/Controllers/Api/TicketTemplateController.php:27
 * @route '/api/ticket-templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::store
 * @see app/Http/Controllers/Api/TicketTemplateController.php:27
 * @route '/api/ticket-templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\TicketTemplateController::show
 * @see app/Http/Controllers/Api/TicketTemplateController.php:79
 * @route '/api/ticket-templates/{ticket_template}'
 */
export const show = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/ticket-templates/{ticket_template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::show
 * @see app/Http/Controllers/Api/TicketTemplateController.php:79
 * @route '/api/ticket-templates/{ticket_template}'
 */
show.url = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_template: args.ticket_template,
                }

    return show.definition.url
            .replace('{ticket_template}', parsedArgs.ticket_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::show
 * @see app/Http/Controllers/Api/TicketTemplateController.php:79
 * @route '/api/ticket-templates/{ticket_template}'
 */
show.get = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketTemplateController::show
 * @see app/Http/Controllers/Api/TicketTemplateController.php:79
 * @route '/api/ticket-templates/{ticket_template}'
 */
show.head = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketTemplateController::show
 * @see app/Http/Controllers/Api/TicketTemplateController.php:79
 * @route '/api/ticket-templates/{ticket_template}'
 */
    const showForm = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::show
 * @see app/Http/Controllers/Api/TicketTemplateController.php:79
 * @route '/api/ticket-templates/{ticket_template}'
 */
        showForm.get = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::show
 * @see app/Http/Controllers/Api/TicketTemplateController.php:79
 * @route '/api/ticket-templates/{ticket_template}'
 */
        showForm.head = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Api\TicketTemplateController::update
 * @see app/Http/Controllers/Api/TicketTemplateController.php:86
 * @route '/api/ticket-templates/{ticket_template}'
 */
export const update = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/api/ticket-templates/{ticket_template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::update
 * @see app/Http/Controllers/Api/TicketTemplateController.php:86
 * @route '/api/ticket-templates/{ticket_template}'
 */
update.url = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_template: args.ticket_template,
                }

    return update.definition.url
            .replace('{ticket_template}', parsedArgs.ticket_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::update
 * @see app/Http/Controllers/Api/TicketTemplateController.php:86
 * @route '/api/ticket-templates/{ticket_template}'
 */
update.put = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Api\TicketTemplateController::update
 * @see app/Http/Controllers/Api/TicketTemplateController.php:86
 * @route '/api/ticket-templates/{ticket_template}'
 */
update.patch = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\TicketTemplateController::update
 * @see app/Http/Controllers/Api/TicketTemplateController.php:86
 * @route '/api/ticket-templates/{ticket_template}'
 */
    const updateForm = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::update
 * @see app/Http/Controllers/Api/TicketTemplateController.php:86
 * @route '/api/ticket-templates/{ticket_template}'
 */
        updateForm.put = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::update
 * @see app/Http/Controllers/Api/TicketTemplateController.php:86
 * @route '/api/ticket-templates/{ticket_template}'
 */
        updateForm.patch = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\TicketTemplateController::destroy
 * @see app/Http/Controllers/Api/TicketTemplateController.php:142
 * @route '/api/ticket-templates/{ticket_template}'
 */
export const destroy = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/ticket-templates/{ticket_template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::destroy
 * @see app/Http/Controllers/Api/TicketTemplateController.php:142
 * @route '/api/ticket-templates/{ticket_template}'
 */
destroy.url = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticket_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket_template: args.ticket_template,
                }

    return destroy.definition.url
            .replace('{ticket_template}', parsedArgs.ticket_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketTemplateController::destroy
 * @see app/Http/Controllers/Api/TicketTemplateController.php:142
 * @route '/api/ticket-templates/{ticket_template}'
 */
destroy.delete = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\TicketTemplateController::destroy
 * @see app/Http/Controllers/Api/TicketTemplateController.php:142
 * @route '/api/ticket-templates/{ticket_template}'
 */
    const destroyForm = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketTemplateController::destroy
 * @see app/Http/Controllers/Api/TicketTemplateController.php:142
 * @route '/api/ticket-templates/{ticket_template}'
 */
        destroyForm.delete = (args: { ticket_template: string | number } | [ticket_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ticketTemplates = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
show: Object.assign(show, show),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default ticketTemplates