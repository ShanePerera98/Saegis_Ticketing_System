import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:11
 * @route '/api/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:11
 * @route '/api/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:11
 * @route '/api/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:11
 * @route '/api/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:11
 * @route '/api/notifications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:11
 * @route '/api/notifications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:11
 * @route '/api/notifications'
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
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:22
 * @route '/api/notifications/unread'
 */
export const unread = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})

unread.definition = {
    methods: ["get","head"],
    url: '/api/notifications/unread',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:22
 * @route '/api/notifications/unread'
 */
unread.url = (options?: RouteQueryOptions) => {
    return unread.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:22
 * @route '/api/notifications/unread'
 */
unread.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:22
 * @route '/api/notifications/unread'
 */
unread.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unread.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:22
 * @route '/api/notifications/unread'
 */
    const unreadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: unread.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:22
 * @route '/api/notifications/unread'
 */
        unreadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unread.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:22
 * @route '/api/notifications/unread'
 */
        unreadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unread.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    unread.form = unreadForm
/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:53
 * @route '/api/notifications/mark-all-read'
 */
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/api/notifications/mark-all-read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:53
 * @route '/api/notifications/mark-all-read'
 */
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:53
 * @route '/api/notifications/mark-all-read'
 */
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:53
 * @route '/api/notifications/mark-all-read'
 */
    const markAllAsReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllAsRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:53
 * @route '/api/notifications/mark-all-read'
 */
        markAllAsReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllAsRead.url(options),
            method: 'post',
        })
    
    markAllAsRead.form = markAllAsReadForm
/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:36
 * @route '/api/notifications/{notification}/read'
 */
export const markAsRead = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/api/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:36
 * @route '/api/notifications/{notification}/read'
 */
markAsRead.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return markAsRead.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:36
 * @route '/api/notifications/{notification}/read'
 */
markAsRead.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:36
 * @route '/api/notifications/{notification}/read'
 */
    const markAsReadForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsRead.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:36
 * @route '/api/notifications/{notification}/read'
 */
        markAsReadForm.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsRead.url(args, options),
            method: 'post',
        })
    
    markAsRead.form = markAsReadForm
/**
* @see \App\Http\Controllers\Api\NotificationController::acceptCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:62
 * @route '/api/notifications/{notification}/accept'
 */
export const acceptCollaboration = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptCollaboration.url(args, options),
    method: 'post',
})

acceptCollaboration.definition = {
    methods: ["post"],
    url: '/api/notifications/{notification}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::acceptCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:62
 * @route '/api/notifications/{notification}/accept'
 */
acceptCollaboration.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return acceptCollaboration.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::acceptCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:62
 * @route '/api/notifications/{notification}/accept'
 */
acceptCollaboration.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptCollaboration.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::acceptCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:62
 * @route '/api/notifications/{notification}/accept'
 */
    const acceptCollaborationForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: acceptCollaboration.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::acceptCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:62
 * @route '/api/notifications/{notification}/accept'
 */
        acceptCollaborationForm.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: acceptCollaboration.url(args, options),
            method: 'post',
        })
    
    acceptCollaboration.form = acceptCollaborationForm
/**
* @see \App\Http\Controllers\Api\NotificationController::rejectCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:123
 * @route '/api/notifications/{notification}/reject'
 */
export const rejectCollaboration = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectCollaboration.url(args, options),
    method: 'post',
})

rejectCollaboration.definition = {
    methods: ["post"],
    url: '/api/notifications/{notification}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::rejectCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:123
 * @route '/api/notifications/{notification}/reject'
 */
rejectCollaboration.url = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: args.notification,
                }

    return rejectCollaboration.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::rejectCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:123
 * @route '/api/notifications/{notification}/reject'
 */
rejectCollaboration.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejectCollaboration.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::rejectCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:123
 * @route '/api/notifications/{notification}/reject'
 */
    const rejectCollaborationForm = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rejectCollaboration.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::rejectCollaboration
 * @see app/Http/Controllers/Api/NotificationController.php:123
 * @route '/api/notifications/{notification}/reject'
 */
        rejectCollaborationForm.post = (args: { notification: string | number } | [notification: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rejectCollaboration.url(args, options),
            method: 'post',
        })
    
    rejectCollaboration.form = rejectCollaborationForm
const NotificationController = { index, unread, markAllAsRead, markAsRead, acceptCollaboration, rejectCollaboration }

export default NotificationController