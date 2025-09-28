import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ActivityLogController::index
 * @see app/Http/Controllers/Api/ActivityLogController.php:12
 * @route '/api/activity-logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/activity-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ActivityLogController::index
 * @see app/Http/Controllers/Api/ActivityLogController.php:12
 * @route '/api/activity-logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ActivityLogController::index
 * @see app/Http/Controllers/Api/ActivityLogController.php:12
 * @route '/api/activity-logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ActivityLogController::index
 * @see app/Http/Controllers/Api/ActivityLogController.php:12
 * @route '/api/activity-logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ActivityLogController::index
 * @see app/Http/Controllers/Api/ActivityLogController.php:12
 * @route '/api/activity-logs'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ActivityLogController::index
 * @see app/Http/Controllers/Api/ActivityLogController.php:12
 * @route '/api/activity-logs'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ActivityLogController::index
 * @see app/Http/Controllers/Api/ActivityLogController.php:12
 * @route '/api/activity-logs'
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
* @see \App\Http\Controllers\Api\ActivityLogController::stats
 * @see app/Http/Controllers/Api/ActivityLogController.php:69
 * @route '/api/activity-logs/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/activity-logs/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ActivityLogController::stats
 * @see app/Http/Controllers/Api/ActivityLogController.php:69
 * @route '/api/activity-logs/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ActivityLogController::stats
 * @see app/Http/Controllers/Api/ActivityLogController.php:69
 * @route '/api/activity-logs/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ActivityLogController::stats
 * @see app/Http/Controllers/Api/ActivityLogController.php:69
 * @route '/api/activity-logs/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ActivityLogController::stats
 * @see app/Http/Controllers/Api/ActivityLogController.php:69
 * @route '/api/activity-logs/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ActivityLogController::stats
 * @see app/Http/Controllers/Api/ActivityLogController.php:69
 * @route '/api/activity-logs/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ActivityLogController::stats
 * @see app/Http/Controllers/Api/ActivityLogController.php:69
 * @route '/api/activity-logs/stats'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
/**
* @see \App\Http\Controllers\Api\ActivityLogController::forTicket
 * @see app/Http/Controllers/Api/ActivityLogController.php:58
 * @route '/api/activity-logs/ticket/{ticketId}'
 */
export const forTicket = (args: { ticketId: string | number } | [ticketId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forTicket.url(args, options),
    method: 'get',
})

forTicket.definition = {
    methods: ["get","head"],
    url: '/api/activity-logs/ticket/{ticketId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ActivityLogController::forTicket
 * @see app/Http/Controllers/Api/ActivityLogController.php:58
 * @route '/api/activity-logs/ticket/{ticketId}'
 */
forTicket.url = (args: { ticketId: string | number } | [ticketId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticketId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ticketId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticketId: args.ticketId,
                }

    return forTicket.definition.url
            .replace('{ticketId}', parsedArgs.ticketId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ActivityLogController::forTicket
 * @see app/Http/Controllers/Api/ActivityLogController.php:58
 * @route '/api/activity-logs/ticket/{ticketId}'
 */
forTicket.get = (args: { ticketId: string | number } | [ticketId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forTicket.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ActivityLogController::forTicket
 * @see app/Http/Controllers/Api/ActivityLogController.php:58
 * @route '/api/activity-logs/ticket/{ticketId}'
 */
forTicket.head = (args: { ticketId: string | number } | [ticketId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: forTicket.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ActivityLogController::forTicket
 * @see app/Http/Controllers/Api/ActivityLogController.php:58
 * @route '/api/activity-logs/ticket/{ticketId}'
 */
    const forTicketForm = (args: { ticketId: string | number } | [ticketId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: forTicket.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ActivityLogController::forTicket
 * @see app/Http/Controllers/Api/ActivityLogController.php:58
 * @route '/api/activity-logs/ticket/{ticketId}'
 */
        forTicketForm.get = (args: { ticketId: string | number } | [ticketId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: forTicket.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ActivityLogController::forTicket
 * @see app/Http/Controllers/Api/ActivityLogController.php:58
 * @route '/api/activity-logs/ticket/{ticketId}'
 */
        forTicketForm.head = (args: { ticketId: string | number } | [ticketId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: forTicket.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    forTicket.form = forTicketForm
/**
* @see \App\Http\Controllers\Api\ActivityLogController::show
 * @see app/Http/Controllers/Api/ActivityLogController.php:51
 * @route '/api/activity-logs/{activityLog}'
 */
export const show = (args: { activityLog: string | number | { id: string | number } } | [activityLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/activity-logs/{activityLog}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ActivityLogController::show
 * @see app/Http/Controllers/Api/ActivityLogController.php:51
 * @route '/api/activity-logs/{activityLog}'
 */
show.url = (args: { activityLog: string | number | { id: string | number } } | [activityLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { activityLog: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { activityLog: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    activityLog: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        activityLog: typeof args.activityLog === 'object'
                ? args.activityLog.id
                : args.activityLog,
                }

    return show.definition.url
            .replace('{activityLog}', parsedArgs.activityLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ActivityLogController::show
 * @see app/Http/Controllers/Api/ActivityLogController.php:51
 * @route '/api/activity-logs/{activityLog}'
 */
show.get = (args: { activityLog: string | number | { id: string | number } } | [activityLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ActivityLogController::show
 * @see app/Http/Controllers/Api/ActivityLogController.php:51
 * @route '/api/activity-logs/{activityLog}'
 */
show.head = (args: { activityLog: string | number | { id: string | number } } | [activityLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ActivityLogController::show
 * @see app/Http/Controllers/Api/ActivityLogController.php:51
 * @route '/api/activity-logs/{activityLog}'
 */
    const showForm = (args: { activityLog: string | number | { id: string | number } } | [activityLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ActivityLogController::show
 * @see app/Http/Controllers/Api/ActivityLogController.php:51
 * @route '/api/activity-logs/{activityLog}'
 */
        showForm.get = (args: { activityLog: string | number | { id: string | number } } | [activityLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ActivityLogController::show
 * @see app/Http/Controllers/Api/ActivityLogController.php:51
 * @route '/api/activity-logs/{activityLog}'
 */
        showForm.head = (args: { activityLog: string | number | { id: string | number } } | [activityLog: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ActivityLogController = { index, stats, forTicket, show }

export default ActivityLogController