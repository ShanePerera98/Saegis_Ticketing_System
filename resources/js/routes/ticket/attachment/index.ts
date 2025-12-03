import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TicketController::download
 * @see app/Http/Controllers/Api/TicketController.php:634
 * @route '/api/tickets/{ticket}/attachments/{attachment}/download'
 */
export const download = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/tickets/{ticket}/attachments/{attachment}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::download
 * @see app/Http/Controllers/Api/TicketController.php:634
 * @route '/api/tickets/{ticket}/attachments/{attachment}/download'
 */
download.url = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                    attachment: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                                attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return download.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::download
 * @see app/Http/Controllers/Api/TicketController.php:634
 * @route '/api/tickets/{ticket}/attachments/{attachment}/download'
 */
download.get = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::download
 * @see app/Http/Controllers/Api/TicketController.php:634
 * @route '/api/tickets/{ticket}/attachments/{attachment}/download'
 */
download.head = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::download
 * @see app/Http/Controllers/Api/TicketController.php:634
 * @route '/api/tickets/{ticket}/attachments/{attachment}/download'
 */
    const downloadForm = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::download
 * @see app/Http/Controllers/Api/TicketController.php:634
 * @route '/api/tickets/{ticket}/attachments/{attachment}/download'
 */
        downloadForm.get = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::download
 * @see app/Http/Controllers/Api/TicketController.php:634
 * @route '/api/tickets/{ticket}/attachments/{attachment}/download'
 */
        downloadForm.head = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\TicketController::view
 * @see app/Http/Controllers/Api/TicketController.php:649
 * @route '/api/tickets/{ticket}/attachments/{attachment}/view'
 */
export const view = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/api/tickets/{ticket}/attachments/{attachment}/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TicketController::view
 * @see app/Http/Controllers/Api/TicketController.php:649
 * @route '/api/tickets/{ticket}/attachments/{attachment}/view'
 */
view.url = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    ticket: args[0],
                    attachment: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ticket: typeof args.ticket === 'object'
                ? args.ticket.id
                : args.ticket,
                                attachment: typeof args.attachment === 'object'
                ? args.attachment.id
                : args.attachment,
                }

    return view.definition.url
            .replace('{ticket}', parsedArgs.ticket.toString())
            .replace('{attachment}', parsedArgs.attachment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TicketController::view
 * @see app/Http/Controllers/Api/TicketController.php:649
 * @route '/api/tickets/{ticket}/attachments/{attachment}/view'
 */
view.get = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TicketController::view
 * @see app/Http/Controllers/Api/TicketController.php:649
 * @route '/api/tickets/{ticket}/attachments/{attachment}/view'
 */
view.head = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TicketController::view
 * @see app/Http/Controllers/Api/TicketController.php:649
 * @route '/api/tickets/{ticket}/attachments/{attachment}/view'
 */
    const viewForm = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TicketController::view
 * @see app/Http/Controllers/Api/TicketController.php:649
 * @route '/api/tickets/{ticket}/attachments/{attachment}/view'
 */
        viewForm.get = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TicketController::view
 * @see app/Http/Controllers/Api/TicketController.php:649
 * @route '/api/tickets/{ticket}/attachments/{attachment}/view'
 */
        viewForm.head = (args: { ticket: number | { id: number }, attachment: number | { id: number } } | [ticket: number | { id: number }, attachment: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
const attachment = {
    download: Object.assign(download, download),
view: Object.assign(view, view),
}

export default attachment