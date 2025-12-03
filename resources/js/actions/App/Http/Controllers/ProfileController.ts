import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:18
 * @route '/api/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:18
 * @route '/api/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:18
 * @route '/api/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:18
 * @route '/api/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:18
 * @route '/api/profile'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:18
 * @route '/api/profile'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProfileController::show
 * @see app/Http/Controllers/ProfileController.php:18
 * @route '/api/profile'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:39
 * @route '/api/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:39
 * @route '/api/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:39
 * @route '/api/profile'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:39
 * @route '/api/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::update
 * @see app/Http/Controllers/ProfileController.php:39
 * @route '/api/profile'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ProfileController::updatePassword
 * @see app/Http/Controllers/ProfileController.php:76
 * @route '/api/profile/password'
 */
export const updatePassword = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

updatePassword.definition = {
    methods: ["patch"],
    url: '/api/profile/password',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ProfileController::updatePassword
 * @see app/Http/Controllers/ProfileController.php:76
 * @route '/api/profile/password'
 */
updatePassword.url = (options?: RouteQueryOptions) => {
    return updatePassword.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::updatePassword
 * @see app/Http/Controllers/ProfileController.php:76
 * @route '/api/profile/password'
 */
updatePassword.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePassword.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProfileController::updatePassword
 * @see app/Http/Controllers/ProfileController.php:76
 * @route '/api/profile/password'
 */
    const updatePasswordForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePassword.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::updatePassword
 * @see app/Http/Controllers/ProfileController.php:76
 * @route '/api/profile/password'
 */
        updatePasswordForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePassword.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePassword.form = updatePasswordForm
/**
* @see \App\Http\Controllers\ProfileController::sendPasswordResetEmail
 * @see app/Http/Controllers/ProfileController.php:115
 * @route '/api/profile/password-reset-email'
 */
export const sendPasswordResetEmail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendPasswordResetEmail.url(options),
    method: 'post',
})

sendPasswordResetEmail.definition = {
    methods: ["post"],
    url: '/api/profile/password-reset-email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProfileController::sendPasswordResetEmail
 * @see app/Http/Controllers/ProfileController.php:115
 * @route '/api/profile/password-reset-email'
 */
sendPasswordResetEmail.url = (options?: RouteQueryOptions) => {
    return sendPasswordResetEmail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::sendPasswordResetEmail
 * @see app/Http/Controllers/ProfileController.php:115
 * @route '/api/profile/password-reset-email'
 */
sendPasswordResetEmail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendPasswordResetEmail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProfileController::sendPasswordResetEmail
 * @see app/Http/Controllers/ProfileController.php:115
 * @route '/api/profile/password-reset-email'
 */
    const sendPasswordResetEmailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendPasswordResetEmail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::sendPasswordResetEmail
 * @see app/Http/Controllers/ProfileController.php:115
 * @route '/api/profile/password-reset-email'
 */
        sendPasswordResetEmailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendPasswordResetEmail.url(options),
            method: 'post',
        })
    
    sendPasswordResetEmail.form = sendPasswordResetEmailForm
/**
* @see \App\Http\Controllers\ProfileController::updateProfileImage
 * @see app/Http/Controllers/ProfileController.php:149
 * @route '/api/profile/image'
 */
export const updateProfileImage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfileImage.url(options),
    method: 'post',
})

updateProfileImage.definition = {
    methods: ["post"],
    url: '/api/profile/image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProfileController::updateProfileImage
 * @see app/Http/Controllers/ProfileController.php:149
 * @route '/api/profile/image'
 */
updateProfileImage.url = (options?: RouteQueryOptions) => {
    return updateProfileImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::updateProfileImage
 * @see app/Http/Controllers/ProfileController.php:149
 * @route '/api/profile/image'
 */
updateProfileImage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateProfileImage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProfileController::updateProfileImage
 * @see app/Http/Controllers/ProfileController.php:149
 * @route '/api/profile/image'
 */
    const updateProfileImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateProfileImage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::updateProfileImage
 * @see app/Http/Controllers/ProfileController.php:149
 * @route '/api/profile/image'
 */
        updateProfileImageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateProfileImage.url(options),
            method: 'post',
        })
    
    updateProfileImage.form = updateProfileImageForm
/**
* @see \App\Http\Controllers\ProfileController::deleteProfileImage
 * @see app/Http/Controllers/ProfileController.php:211
 * @route '/api/profile/image'
 */
export const deleteProfileImage = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProfileImage.url(options),
    method: 'delete',
})

deleteProfileImage.definition = {
    methods: ["delete"],
    url: '/api/profile/image',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProfileController::deleteProfileImage
 * @see app/Http/Controllers/ProfileController.php:211
 * @route '/api/profile/image'
 */
deleteProfileImage.url = (options?: RouteQueryOptions) => {
    return deleteProfileImage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProfileController::deleteProfileImage
 * @see app/Http/Controllers/ProfileController.php:211
 * @route '/api/profile/image'
 */
deleteProfileImage.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProfileImage.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProfileController::deleteProfileImage
 * @see app/Http/Controllers/ProfileController.php:211
 * @route '/api/profile/image'
 */
    const deleteProfileImageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteProfileImage.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProfileController::deleteProfileImage
 * @see app/Http/Controllers/ProfileController.php:211
 * @route '/api/profile/image'
 */
        deleteProfileImageForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteProfileImage.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteProfileImage.form = deleteProfileImageForm
const ProfileController = { show, update, updatePassword, sendPasswordResetEmail, updateProfileImage, deleteProfileImage }

export default ProfileController