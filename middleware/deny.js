// create a middleware function that disallows requests if they come from Insomnia or Postman

// the basis of all middleware functions is an exported function that returns another function
module.exports = () => {
    return (req, res, next) => {
        // we can get information about the client from the request headers
        // specifically the user-agent header
        // we use bracket notation to access the user-agent property in the req.headers object because user-agent has a dash in it, so dot notation would be invalid
        const agent = req.headers["user-agent"]
        // /insomnia/.test(agent) is a regular expression
        // it tests if the value of agent contains the string "insomnia"
        if (/insomnia/.test(agent)) {
            // the client is Insomnia, deny them access
            return res.status(418).json({
                message: "No Insomnia allowed here",
            })
            // we don't want to move on to the next middleware if we get this error
            // so we just return the error (we did that above)
            // then we just don't call next
        }
        // otherwise let them through
        // we only call next if we want to move on to the next middleware
        next()
    }
}