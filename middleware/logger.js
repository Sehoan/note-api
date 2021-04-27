const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path: ', request.path);
    console.log('Body: ', request.body);
    console.log('---');
    next();
    /*
     * middleware is run in the order it's used by an express app
     * => app.use(middleware_name)
     * next() passes the control to the next middleware and let the next one
     * does its job
     */
}

module.exports = requestLogger;

