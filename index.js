// to use 3rd party MW, just install it, import it, server.use it
const express = require("express")
// morgan = third party middleware
// import morgan
const morgan = require("morgan")
// import our custom middleware
const logger = require("./middleware/logger")
// import our deny middleware
const deny = require("./middleware/deny")
const welcomeRouter = require("./welcome/welcome-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = 4000

// these "server.use"s are globally installed
server.use(express.json())
// install the Morgan middleware using the "combined" format
//server.use(morgan("combined"))

// use our deny middleware
// install it above the logger so error requests are not logged if the user is denied
//server.use(deny())

// mimick the functionality of Morgan with custom middleware
// pass in third parameter (convention to call it "next") that will tell express when to move on to the next middleware
// we moved the code that lives in "use" to logger.js
// use it in our code by calling it inside server.use
server.use(logger())

server.use(welcomeRouter)
server.use(usersRouter)

// error middleware that "catches" any errors from other middleware functions
// error middleware is always the last piece of middleware
server.use((err, req, res, next) => {
	console.log(err)

	res.status(500).json({
		message: "Something went wrong, try again later"
	})
})

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
