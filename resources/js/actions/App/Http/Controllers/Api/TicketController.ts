import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:22
 * @route '/api/tickets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/tickets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:22
 * @route '/api/tickets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:22
 * @route '/api/tickets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:22
 * @route '/api/tickets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:22
 * @route '/api/tickets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:22
 * @route '/api/tickets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::index
 * @see app/Http/Controllers/Api/TicketController.php:22
 * @route '/api/tickets'
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
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:54
 * @route '/api/tickets'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/tickets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:54
 * @route '/api/tickets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:54
 * @route '/api/tickets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:54
 * @route '/api/tickets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::store
 * @see app/Http/Controllers/Api/TicketController.php:54
 * @route '/api/tickets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\TicketController::cancelled
 * @see app/Http/Controllers/Api/TicketController.php:259
 * @route '/api/tickets/cancelled'
 */
export const cancelled = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cancelled.url(options),
    method: 'get',
})

cancelled.definition = {
    methods: ["get","head"],
    url: '/api/tickets/cancelled',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::cancelled
 * @see app/Http/Controllers/Api/TicketController.php:259
 * @route '/api/tickets/cancelled'
 */
cancelled.url = (options?: RouteQueryOptions) => {
    return cancelled.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::cancelled
 * @see app/Http/Controllers/Api/TicketController.php:259
 * @route '/api/tickets/cancelled'
 */
cancelled.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cancelled.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::cancelled
 * @see app/Http/Controllers/Api/TicketController.php:259
 * @route '/api/tickets/cancelled'
 */
cancelled.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cancelled.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::cancelled
 * @see app/Http/Controllers/Api/TicketController.php:259
 * @route '/api/tickets/cancelled'
 */
    const cancelledForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cancelled.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::cancelled
 * @see app/Http/Controllers/Api/TicketController.php:259
 * @route '/api/tickets/cancelled'
 */
        cancelledForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cancelled.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::cancelled
 * @see app/Http/Controllers/Api/TicketController.php:259
 * @route '/api/tickets/cancelled'
 */
        cancelledForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cancelled.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cancelled.form = cancelledForm
/**
* @see \App\Http\Controllers\Api\TicketController::approveCancellation
 * @see app/Http/Controllers/Api/TicketController.php:279
 * @route '/api/tickets/cancelled/{id}/approve'
 */
export const approveCancellation = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveCancellation.url(args, options),
    method: 'post',
})

approveCancellation.definition = {
    methods: ["post"],
    url: '/api/tickets/cancelled/{id}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::approveCancellation
 * @see app/Http/Controllers/Api/TicketController.php:279
 * @route '/api/tickets/cancelled/{id}/approve'
 */
approveCancellation.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return approveCancellation.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::approveCancellation
 * @see app/Http/Controllers/Api/TicketController.php:279
 * @route '/api/tickets/cancelled/{id}/approve'
 */
approveCancellation.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approveCancellation.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::approveCancellation
 * @see app/Http/Controllers/Api/TicketController.php:279
 * @route '/api/tickets/cancelled/{id}/approve'
 */
    const approveCancellationForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approveCancellation.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::approveCancellation
 * @see app/Http/Controllers/Api/TicketController.php:279
 * @route '/api/tickets/cancelled/{id}/approve'
 */
        approveCancellationForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approveCancellation.url(args, options),
            method: 'post',
        })
    
    approveCancellation.form = approveCancellationForm
/**
* @see \App\Http\Controllers\Api\TicketController::restoreTicket
 * @see app/Http/Controllers/Api/TicketController.php:288
 * @route '/api/tickets/cancelled/{id}/restore'
 */
export const restoreTicket = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreTicket.url(args, options),
    method: 'post',
})

restoreTicket.definition = {
    methods: ["post"],
    url: '/api/tickets/cancelled/{id}/restore',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::restoreTicket
 * @see app/Http/Controllers/Api/TicketController.php:288
 * @route '/api/tickets/cancelled/{id}/restore'
 */
restoreTicket.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return restoreTicket.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::restoreTicket
 * @see app/Http/Controllers/Api/TicketController.php:288
 * @route '/api/tickets/cancelled/{id}/restore'
 */
restoreTicket.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restoreTicket.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::restoreTicket
 * @see app/Http/Controllers/Api/TicketController.php:288
 * @route '/api/tickets/cancelled/{id}/restore'
 */
    const restoreTicketForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restoreTicket.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::restoreTicket
 * @see app/Http/Controllers/Api/TicketController.php:288
 * @route '/api/tickets/cancelled/{id}/restore'
 */
        restoreTicketForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restoreTicket.url(args, options),
            method: 'post',
        })
    
    restoreTicket.form = restoreTicketForm
/**
* @see \App\Http\Controllers\Api\TicketController::merges
 * @see app/Http/Controllers/Api/TicketController.php:297
 * @route '/api/tickets/merges'
 */
export const merges = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: merges.url(options),
    method: 'get',
})

merges.definition = {
    methods: ["get","head"],
    url: '/api/tickets/merges',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::merges
 * @see app/Http/Controllers/Api/TicketController.php:297
 * @route '/api/tickets/merges'
 */
merges.url = (options?: RouteQueryOptions) => {
    return merges.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::merges
 * @see app/Http/Controllers/Api/TicketController.php:297
 * @route '/api/tickets/merges'
 */
merges.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: merges.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::merges
 * @see app/Http/Controllers/Api/TicketController.php:297
 * @route '/api/tickets/merges'
 */
merges.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: merges.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::merges
 * @see app/Http/Controllers/Api/TicketController.php:297
 * @route '/api/tickets/merges'
 */
    const mergesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: merges.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::merges
 * @see app/Http/Controllers/Api/TicketController.php:297
 * @route '/api/tickets/merges'
 */
        mergesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: merges.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::merges
 * @see app/Http/Controllers/Api/TicketController.php:297
 * @route '/api/tickets/merges'
 */
        mergesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: merges.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    merges.form = mergesForm
/**
* @see \App\Http\Controllers\Api\TicketController::reports
 * @see app/Http/Controllers/Api/TicketController.php:312
 * @route '/api/tickets/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/api/tickets/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::reports
 * @see app/Http/Controllers/Api/TicketController.php:312
 * @route '/api/tickets/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::reports
 * @see app/Http/Controllers/Api/TicketController.php:312
 * @route '/api/tickets/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::reports
 * @see app/Http/Controllers/Api/TicketController.php:312
 * @route '/api/tickets/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::reports
 * @see app/Http/Controllers/Api/TicketController.php:312
 * @route '/api/tickets/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::reports
 * @see app/Http/Controllers/Api/TicketController.php:312
 * @route '/api/tickets/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::reports
 * @see app/Http/Controllers/Api/TicketController.php:312
 * @route '/api/tickets/reports'
 */
        reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reports.form = reportsForm
/**
* @see \App\Http\Controllers\Api\TicketController::stats
 * @see app/Http/Controllers/Api/TicketController.php:331
 * @route '/api/tickets/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/tickets/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::stats
 * @see app/Http/Controllers/Api/TicketController.php:331
 * @route '/api/tickets/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::stats
 * @see app/Http/Controllers/Api/TicketController.php:331
 * @route '/api/tickets/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::stats
 * @see app/Http/Controllers/Api/TicketController.php:331
 * @route '/api/tickets/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::stats
 * @see app/Http/Controllers/Api/TicketController.php:331
 * @route '/api/tickets/stats'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::stats
 * @see app/Http/Controllers/Api/TicketController.php:331
 * @route '/api/tickets/stats'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::stats
 * @see app/Http/Controllers/Api/TicketController.php:331
 * @route '/api/tickets/stats'
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
* @see \App\Http\Controllers\Api\TicketController::exportMethod
 * @see app/Http/Controllers/Api/TicketController.php:364
 * @route '/api/tickets/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/api/tickets/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::exportMethod
 * @see app/Http/Controllers/Api/TicketController.php:364
 * @route '/api/tickets/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::exportMethod
 * @see app/Http/Controllers/Api/TicketController.php:364
 * @route '/api/tickets/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::exportMethod
 * @see app/Http/Controllers/Api/TicketController.php:364
 * @route '/api/tickets/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::exportMethod
 * @see app/Http/Controllers/Api/TicketController.php:364
 * @route '/api/tickets/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::exportMethod
 * @see app/Http/Controllers/Api/TicketController.php:364
 * @route '/api/tickets/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::exportMethod
 * @see app/Http/Controllers/Api/TicketController.php:364
 * @route '/api/tickets/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\Api\TicketController::merge
 * @see app/Http/Controllers/Api/TicketController.php:192
 * @route '/api/tickets/merge'
 */
export const merge = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: merge.url(options),
    method: 'post',
})

merge.definition = {
    methods: ["post"],
    url: '/api/tickets/merge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::merge
 * @see app/Http/Controllers/Api/TicketController.php:192
 * @route '/api/tickets/merge'
 */
merge.url = (options?: RouteQueryOptions) => {
    return merge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::merge
 * @see app/Http/Controllers/Api/TicketController.php:192
 * @route '/api/tickets/merge'
 */
merge.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: merge.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::merge
 * @see app/Http/Controllers/Api/TicketController.php:192
 * @route '/api/tickets/merge'
 */
    const mergeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: merge.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::merge
 * @see app/Http/Controllers/Api/TicketController.php:192
 * @route '/api/tickets/merge'
 */
        mergeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: merge.url(options),
            method: 'post',
        })
    
    merge.form = mergeForm
/**
* @see \App\Http\Controllers\Api\TicketController::undoMerge
 * @see app/Http/Controllers/Api/TicketController.php:217
 * @route '/api/tickets/merge/{mergeId}/undo'
 */
export const undoMerge = (args: { mergeId: string | number } | [mergeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: undoMerge.url(args, options),
    method: 'post',
})

undoMerge.definition = {
    methods: ["post"],
    url: '/api/tickets/merge/{mergeId}/undo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::undoMerge
 * @see app/Http/Controllers/Api/TicketController.php:217
 * @route '/api/tickets/merge/{mergeId}/undo'
 */
undoMerge.url = (args: { mergeId: string | number } | [mergeId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { mergeId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    mergeId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        mergeId: args.mergeId,
                }

    return undoMerge.definition.url
            .replace('{mergeId}', parsedArgs.mergeId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::undoMerge
 * @see app/Http/Controllers/Api/TicketController.php:217
 * @route '/api/tickets/merge/{mergeId}/undo'
 */
undoMerge.post = (args: { mergeId: string | number } | [mergeId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: undoMerge.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::undoMerge
 * @see app/Http/Controllers/Api/TicketController.php:217
 * @route '/api/tickets/merge/{mergeId}/undo'
 */
    const undoMergeForm = (args: { mergeId: string | number } | [mergeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: undoMerge.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::undoMerge
 * @see app/Http/Controllers/Api/TicketController.php:217
 * @route '/api/tickets/merge/{mergeId}/undo'
 */
        undoMergeForm.post = (args: { mergeId: string | number } | [mergeId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: undoMerge.url(args, options),
            method: 'post',
        })
    
    undoMerge.form = undoMergeForm
/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:81
 * @route '/api/tickets/{ticket}'
 */
export const show = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/tickets/{ticket}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:81
 * @route '/api/tickets/{ticket}'
 */
show.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return show.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:81
 * @route '/api/tickets/{ticket}'
 */
show.get = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:81
 * @route '/api/tickets/{ticket}'
 */
show.head = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:81
 * @route '/api/tickets/{ticket}'
 */
    const showForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:81
 * @route '/api/tickets/{ticket}'
 */
        showForm.get = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::show
 * @see app/Http/Controllers/Api/TicketController.php:81
 * @route '/api/tickets/{ticket}'
 */
        showForm.head = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:102
 * @route '/api/tickets/{ticket}'
 */
export const update = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/tickets/{ticket}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:102
 * @route '/api/tickets/{ticket}'
 */
update.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return update.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:102
 * @route '/api/tickets/{ticket}'
 */
update.patch = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:102
 * @route '/api/tickets/{ticket}'
 */
    const updateForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::update
 * @see app/Http/Controllers/Api/TicketController.php:102
 * @route '/api/tickets/{ticket}'
 */
        updateForm.patch = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\TicketController::assignSelf
 * @see app/Http/Controllers/Api/TicketController.php:118
 * @route '/api/tickets/{ticket}/assign/self'
 */
export const assignSelf = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignSelf.url(args, options),
    method: 'post',
})

assignSelf.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/assign/self',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::assignSelf
 * @see app/Http/Controllers/Api/TicketController.php:118
 * @route '/api/tickets/{ticket}/assign/self'
 */
assignSelf.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return assignSelf.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::assignSelf
 * @see app/Http/Controllers/Api/TicketController.php:118
 * @route '/api/tickets/{ticket}/assign/self'
 */
assignSelf.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignSelf.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::assignSelf
 * @see app/Http/Controllers/Api/TicketController.php:118
 * @route '/api/tickets/{ticket}/assign/self'
 */
    const assignSelfForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assignSelf.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::assignSelf
 * @see app/Http/Controllers/Api/TicketController.php:118
 * @route '/api/tickets/{ticket}/assign/self'
 */
        assignSelfForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assignSelf.url(args, options),
            method: 'post',
        })
    
    assignSelf.form = assignSelfForm
/**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:127
 * @route '/api/tickets/{ticket}/assign'
 */
export const assign = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

assign.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:127
 * @route '/api/tickets/{ticket}/assign'
 */
assign.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return assign.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:127
 * @route '/api/tickets/{ticket}/assign'
 */
assign.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assign.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:127
 * @route '/api/tickets/{ticket}/assign'
 */
    const assignForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: assign.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::assign
 * @see app/Http/Controllers/Api/TicketController.php:127
 * @route '/api/tickets/{ticket}/assign'
 */
        assignForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: assign.url(args, options),
            method: 'post',
        })
    
    assign.form = assignForm
/**
* @see \App\Http\Controllers\Api\TicketController::addCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:141
 * @route '/api/tickets/{ticket}/collaborators'
 */
export const addCollaborator = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addCollaborator.url(args, options),
    method: 'post',
})

addCollaborator.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/collaborators',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::addCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:141
 * @route '/api/tickets/{ticket}/collaborators'
 */
addCollaborator.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return addCollaborator.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::addCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:141
 * @route '/api/tickets/{ticket}/collaborators'
 */
addCollaborator.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addCollaborator.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::addCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:141
 * @route '/api/tickets/{ticket}/collaborators'
 */
    const addCollaboratorForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: addCollaborator.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::addCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:141
 * @route '/api/tickets/{ticket}/collaborators'
 */
        addCollaboratorForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: addCollaborator.url(args, options),
            method: 'post',
        })
    
    addCollaborator.form = addCollaboratorForm
/**
* @see \App\Http\Controllers\Api\TicketController::removeCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:155
 * @route '/api/tickets/{ticket}/collaborators/{user}'
 */
export const removeCollaborator = (args: { ticket: number | { id: number }, user: number | { id: number } } | [ticket: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeCollaborator.url(args, options),
    method: 'delete',
})

removeCollaborator.definition = {
    methods: ["delete"],
    url: '/api/tickets/{ticket}/collaborators/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\TicketController::removeCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:155
 * @route '/api/tickets/{ticket}/collaborators/{user}'
 */
removeCollaborator.url = (args: { ticket: number | { id: number }, user: number | { id: number } } | [ticket: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                    user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                                user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return removeCollaborator.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::removeCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:155
 * @route '/api/tickets/{ticket}/collaborators/{user}'
 */
removeCollaborator.delete = (args: { ticket: number | { id: number }, user: number | { id: number } } | [ticket: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: removeCollaborator.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::removeCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:155
 * @route '/api/tickets/{ticket}/collaborators/{user}'
 */
    const removeCollaboratorForm = (args: { ticket: number | { id: number }, user: number | { id: number } } | [ticket: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: removeCollaborator.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::removeCollaborator
 * @see app/Http/Controllers/Api/TicketController.php:155
 * @route '/api/tickets/{ticket}/collaborators/{user}'
 */
        removeCollaboratorForm.delete = (args: { ticket: number | { id: number }, user: number | { id: number } } | [ticket: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: removeCollaborator.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    removeCollaborator.form = removeCollaboratorForm
/**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:164
 * @route '/api/tickets/{ticket}/status'
 */
export const updateStatus = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:164
 * @route '/api/tickets/{ticket}/status'
 */
updateStatus.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return updateStatus.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:164
 * @route '/api/tickets/{ticket}/status'
 */
updateStatus.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:164
 * @route '/api/tickets/{ticket}/status'
 */
    const updateStatusForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::updateStatus
 * @see app/Http/Controllers/Api/TicketController.php:164
 * @route '/api/tickets/{ticket}/status'
 */
        updateStatusForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, options),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Api\TicketController::addComment
 * @see app/Http/Controllers/Api/TicketController.php:239
 * @route '/api/tickets/{ticket}/comments'
 */
export const addComment = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addComment.url(args, options),
    method: 'post',
})

addComment.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::addComment
 * @see app/Http/Controllers/Api/TicketController.php:239
 * @route '/api/tickets/{ticket}/comments'
 */
addComment.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return addComment.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::addComment
 * @see app/Http/Controllers/Api/TicketController.php:239
 * @route '/api/tickets/{ticket}/comments'
 */
addComment.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addComment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::addComment
 * @see app/Http/Controllers/Api/TicketController.php:239
 * @route '/api/tickets/{ticket}/comments'
 */
    const addCommentForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: addComment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::addComment
 * @see app/Http/Controllers/Api/TicketController.php:239
 * @route '/api/tickets/{ticket}/comments'
 */
        addCommentForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: addComment.url(args, options),
            method: 'post',
        })
    
    addComment.form = addCommentForm
/**
* @see \App\Http\Controllers\Api\TicketController::cancelIrrelevant
 * @see app/Http/Controllers/Api/TicketController.php:179
 * @route '/api/tickets/{ticket}/cancel/irrelevant'
 */
export const cancelIrrelevant = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelIrrelevant.url(args, options),
    method: 'post',
})

cancelIrrelevant.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/cancel/irrelevant',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::cancelIrrelevant
 * @see app/Http/Controllers/Api/TicketController.php:179
 * @route '/api/tickets/{ticket}/cancel/irrelevant'
 */
cancelIrrelevant.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return cancelIrrelevant.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::cancelIrrelevant
 * @see app/Http/Controllers/Api/TicketController.php:179
 * @route '/api/tickets/{ticket}/cancel/irrelevant'
 */
cancelIrrelevant.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelIrrelevant.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::cancelIrrelevant
 * @see app/Http/Controllers/Api/TicketController.php:179
 * @route '/api/tickets/{ticket}/cancel/irrelevant'
 */
    const cancelIrrelevantForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelIrrelevant.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::cancelIrrelevant
 * @see app/Http/Controllers/Api/TicketController.php:179
 * @route '/api/tickets/{ticket}/cancel/irrelevant'
 */
        cancelIrrelevantForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelIrrelevant.url(args, options),
            method: 'post',
        })
    
    cancelIrrelevant.form = cancelIrrelevantForm
/**
* @see \App\Http\Controllers\Api\TicketController::clientDelete
 * @see app/Http/Controllers/Api/TicketController.php:226
 * @route '/api/tickets/{ticket}/client-delete'
 */
export const clientDelete = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clientDelete.url(args, options),
    method: 'post',
})

clientDelete.definition = {
    methods: ["post"],
    url: '/api/tickets/{ticket}/client-delete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\TicketController::clientDelete
 * @see app/Http/Controllers/Api/TicketController.php:226
 * @route '/api/tickets/{ticket}/client-delete'
 */
clientDelete.url = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ticket: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ticket: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                }

    return clientDelete.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::clientDelete
 * @see app/Http/Controllers/Api/TicketController.php:226
 * @route '/api/tickets/{ticket}/client-delete'
 */
clientDelete.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clientDelete.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::clientDelete
 * @see app/Http/Controllers/Api/TicketController.php:226
 * @route '/api/tickets/{ticket}/client-delete'
 */
    const clientDeleteForm = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clientDelete.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::clientDelete
 * @see app/Http/Controllers/Api/TicketController.php:226
 * @route '/api/tickets/{ticket}/client-delete'
 */
        clientDeleteForm.post = (args: { ticket: number | { id: number } } | [ticket: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clientDelete.url(args, options),
            method: 'post',
        })
    
    clientDelete.form = clientDeleteForm
const TicketController = { index, store, cancelled, approveCancellation, restoreTicket, merges, reports, stats, exportMethod, merge, undoMerge, show, update, assignSelf, assign, addCollaborator, removeCollaborator, updateStatus, addComment, cancelIrrelevant, clientDelete, export: exportMethod }

export default TicketController