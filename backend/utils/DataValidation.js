export function validatePostData(data) {
    return !(!data.postTitle || data.postTitle === "" || typeof data.postTitle !== 'string' ||
        !data.postAuthor || data.postAuthor === "" || typeof data.postAuthor !== 'string' ||
        !data.postBody || data.postBody === "" || typeof data.postBody !== 'string');
}

export function validateUserSignupData(data) {
    if (!data.username || data.username === '') return false
    if (!data.email || data.email === '') return false
    if (!data.role || data.role === '') return false
    if (!data.password || data.password === '') return false

    if (data.password.length < 8) return false
}
