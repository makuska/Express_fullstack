export function validatePostData(data) {
    return !(!data.postTitle || data.postTitle === "" || typeof data.postTitle !== 'string' ||
        !data.postAuthor || data.postAuthor === "" || typeof data.postAuthor !== 'string' ||
        !data.postBody || data.postBody === "" || typeof data.postBody !== 'string');
}
