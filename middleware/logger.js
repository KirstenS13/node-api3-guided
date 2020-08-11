module.exports = () => {
    // the function below is what we wrote in index.js originally inside of server.use()
    // return the function so that it can be used in other files
    return (req, res, next) => {
        const time = new Date().toISOString()
        // time, ip address, http method, url
        console.log(`${time} ${req.ip} ${req.method} ${req.url} `)
        // middleware functions are asynchronous so
        // we need to tell express when the MW function is done
        // we do that with a third parameter - next
        // we call next when we are done
        // we're done here, move on to the next piece of middleware in the stack (which is the route handler)
        next()
        // we don't need to call next in the route handlers because they send a response back using res.something
        // sending a response is the last thing the middleware stack does, so there is no more middleware to do
        // sending a response ends the request
    }
}