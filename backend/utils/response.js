module.exports = {
    successResponse: (message, data = null) => ({
        status: 'success',
        message,
        data
    }),
    errorResponse: (message, error = null) => ({
        status: 'error',
        message,
        error
    })
};