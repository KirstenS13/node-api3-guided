const express = require("express")
const users = require("./users-model")
const { checkUserID, checkUserData } = require("../middleware/user")

const router = express.Router()

router.get("/users", (req, res) => {
	const options = {
		sortBy: req.query.sortBy,
		limit: req.query.limit,
	}

	users.find(options)
		.then((users) => {
			res.status(200).json(users)
		})
		.catch((error) => {
			// if next gets called with no paramters, then it moves on to the next piece of middleware like normal
			// if it gets called WITH a parameter, it considers that param an error and it moves to the error middleware
			next(error)
			/* console.log(error)
			res.status(500).json({
				message: "Error retrieving the users",
			}) */
		})
})

// runs checkUserID() for only this endpoint, instead of being applied to every endpoint automatically
// this creates a "substack" of middleware to run
router.get("/users/:id", checkUserID(), (req, res) => {
	// code extracted into user.js
	res.status(200).json(req.user)
})

router.post("/users", checkUserData(), (req, res) => {
	// code extracted into user.js

	users.add(req.body)
		.then((user) => {
			res.status(201).json(user)
		})
		.catch((error) => {
			next(error)
			/* console.log(error)
			res.status(500).json({
				message: "Error adding the user",
			}) */
		})
})

// check the data first, because checkUserID does a database lookup
// database lookups cost resources
// no point doing them if you know it's not going to work
// ALWAYS AIM TO MINIMIZE THE NUMBER OF DATABASE REQUESTS
// DON'T MAKE A DATABASE REQUEST UNLESS ABSOLUTELY NECESSARY
router.put("/users/:id", checkUserData(), checkUserID(), (req, res) => {
	/* if (!req.body.name || !req.body.email) {
		return res.status(400).json({
			message: "Missing user name or email",
		})
	} */

	users.update(req.params.id, req.body)
		.then((user) => {
			if (user) {
				res.status(200).json(user)
			} else {
				res.status(404).json({
					message: "The user could not be found",
				})
			}
		})
		.catch((error) => {
			next(error)
			/* console.log(error)
			res.status(500).json({
				message: "Error updating the user",
			}) */
		})
})

router.delete("/users/:id", checkUserID(), (req, res) => {
	users.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The user has been nuked",
				})
			} else {
				res.status(404).json({
					message: "The user could not be found",
				})
			}
		})
		.catch(next) // even shorter than calling next(error) - but not always the right move
})

router.get("/users/:id/posts", checkUserID(), (req, res) => {
	users.findUserPosts(req.params.id)
		.then((posts) => {
			res.status(200).json(posts)
		})
		.catch(next)
})

router.get("/users/:id/posts/:postId", checkUserID(), (req, res) => {
	users.findUserPostById(req.params.id, req.params.postId)
		.then((post) => {
			if (post) {
				res.json(post)
			} else {
				res.status(404).json({
					message: "Post was not found",
				})
			}
		})
		.catch(next)
})

router.post("/users/:id/posts", checkUserID(), (req, res) => {
	if (!req.body.text) {
		return res.status(400).json({
			message: "Need a value for text",
		})
	}

	users.addUserPost(req.params.id, req.body)
		.then((post) => {
			res.status(201).json(post)
		})
		.catch(next)
})

module.exports = router