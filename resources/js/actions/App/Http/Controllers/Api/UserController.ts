import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:18
 * @route '/api/users'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:18
 * @route '/api/users'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:18
 * @route '/api/users'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:18
 * @route '/api/users'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:18
 * @route '/api/users'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:18
 * @route '/api/users'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\UserController::index
 * @see app/Http/Controllers/Api/UserController.php:18
 * @route '/api/users'
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
* @see \App\Http\Controllers\Api\UserController::searchStaff
 * @see app/Http/Controllers/Api/UserController.php:66
 * @route '/api/users/search-staff'
 */
export const searchStaff = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchStaff.url(options),
    method: 'get',
})

searchStaff.definition = {
    methods: ["get","head"],
    url: '/api/users/search-staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::searchStaff
 * @see app/Http/Controllers/Api/UserController.php:66
 * @route '/api/users/search-staff'
 */
searchStaff.url = (options?: RouteQueryOptions) => {
    return searchStaff.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::searchStaff
 * @see app/Http/Controllers/Api/UserController.php:66
 * @route '/api/users/search-staff'
 */
searchStaff.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchStaff.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\UserController::searchStaff
 * @see app/Http/Controllers/Api/UserController.php:66
 * @route '/api/users/search-staff'
 */
searchStaff.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchStaff.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\UserController::searchStaff
 * @see app/Http/Controllers/Api/UserController.php:66
 * @route '/api/users/search-staff'
 */
    const searchStaffForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: searchStaff.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::searchStaff
 * @see app/Http/Controllers/Api/UserController.php:66
 * @route '/api/users/search-staff'
 */
        searchStaffForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchStaff.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\UserController::searchStaff
 * @see app/Http/Controllers/Api/UserController.php:66
 * @route '/api/users/search-staff'
 */
        searchStaffForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: searchStaff.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    searchStaff.form = searchStaffForm
/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:137
 * @route '/api/users/{user}'
 */
export const show = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/users/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:137
 * @route '/api/users/{user}'
 */
show.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return show.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:137
 * @route '/api/users/{user}'
 */
show.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:137
 * @route '/api/users/{user}'
 */
show.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:137
 * @route '/api/users/{user}'
 */
    const showForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:137
 * @route '/api/users/{user}'
 */
        showForm.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\UserController::show
 * @see app/Http/Controllers/Api/UserController.php:137
 * @route '/api/users/{user}'
 */
        showForm.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:163
 * @route '/api/users'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/users',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:163
 * @route '/api/users'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:163
 * @route '/api/users'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:163
 * @route '/api/users'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::store
 * @see app/Http/Controllers/Api/UserController.php:163
 * @route '/api/users'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:203
 * @route '/api/users/{user}'
 */
export const update = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/users/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:203
 * @route '/api/users/{user}'
 */
update.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:203
 * @route '/api/users/{user}'
 */
update.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:203
 * @route '/api/users/{user}'
 */
    const updateForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::update
 * @see app/Http/Controllers/Api/UserController.php:203
 * @route '/api/users/{user}'
 */
        updateForm.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:255
 * @route '/api/users/{user}'
 */
export const destroy = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/users/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:255
 * @route '/api/users/{user}'
 */
destroy.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return destroy.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:255
 * @route '/api/users/{user}'
 */
destroy.delete = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:255
 * @route '/api/users/{user}'
 */
    const destroyForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::destroy
 * @see app/Http/Controllers/Api/UserController.php:255
 * @route '/api/users/{user}'
 */
        destroyForm.delete = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\UserController::updateStatus
 * @see app/Http/Controllers/Api/UserController.php:278
 * @route '/api/users/{user}/status'
 */
export const updateStatus = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/api/users/{user}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\UserController::updateStatus
 * @see app/Http/Controllers/Api/UserController.php:278
 * @route '/api/users/{user}/status'
 */
updateStatus.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return updateStatus.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::updateStatus
 * @see app/Http/Controllers/Api/UserController.php:278
 * @route '/api/users/{user}/status'
 */
updateStatus.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\UserController::updateStatus
 * @see app/Http/Controllers/Api/UserController.php:278
 * @route '/api/users/{user}/status'
 */
    const updateStatusForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::updateStatus
 * @see app/Http/Controllers/Api/UserController.php:278
 * @route '/api/users/{user}/status'
 */
        updateStatusForm.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Api\UserController::sendPasswordReset
 * @see app/Http/Controllers/Api/UserController.php:300
 * @route '/api/users/{user}/send-password-reset'
 */
export const sendPasswordReset = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendPasswordReset.url(args, options),
    method: 'post',
})

sendPasswordReset.definition = {
    methods: ["post"],
    url: '/api/users/{user}/send-password-reset',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserController::sendPasswordReset
 * @see app/Http/Controllers/Api/UserController.php:300
 * @route '/api/users/{user}/send-password-reset'
 */
sendPasswordReset.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return sendPasswordReset.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::sendPasswordReset
 * @see app/Http/Controllers/Api/UserController.php:300
 * @route '/api/users/{user}/send-password-reset'
 */
sendPasswordReset.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendPasswordReset.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\UserController::sendPasswordReset
 * @see app/Http/Controllers/Api/UserController.php:300
 * @route '/api/users/{user}/send-password-reset'
 */
    const sendPasswordResetForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendPasswordReset.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::sendPasswordReset
 * @see app/Http/Controllers/Api/UserController.php:300
 * @route '/api/users/{user}/send-password-reset'
 */
        sendPasswordResetForm.post = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendPasswordReset.url(args, options),
            method: 'post',
        })
    
    sendPasswordReset.form = sendPasswordResetForm
/**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:329
 * @route '/api/users/{user}/reset-password'
 */
export const resetPassword = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resetPassword.url(args, options),
    method: 'patch',
})

resetPassword.definition = {
    methods: ["patch"],
    url: '/api/users/{user}/reset-password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:329
 * @route '/api/users/{user}/reset-password'
 */
resetPassword.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: args.user,
                }

    return resetPassword.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:329
 * @route '/api/users/{user}/reset-password'
 */
resetPassword.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: resetPassword.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:329
 * @route '/api/users/{user}/reset-password'
 */
    const resetPasswordForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resetPassword.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\UserController::resetPassword
 * @see app/Http/Controllers/Api/UserController.php:329
 * @route '/api/users/{user}/reset-password'
 */
        resetPasswordForm.patch = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resetPassword.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    resetPassword.form = resetPasswordForm
const UserController = { index, searchStaff, show, store, update, destroy, updateStatus, sendPasswordReset, resetPassword }

export default UserController