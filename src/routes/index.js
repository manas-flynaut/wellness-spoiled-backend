const { loggerUtil } = require("../utils/logger")
const {isSignedIn , isValidToken} = require("../middleware/index")
const auth = require("./auth")
const userRoute = require("./user")

const routes = (app) => {
    // Test Route for API
    app.get("/welcome", (req, res) => {
        loggerUtil("Welcome API called.")
        res.send("Welcome to API for Wellness Spoiled.\n Servers are Up and Running")
    })

    app.use("/api/v1" , auth)
    app.use('/api/v1', isSignedIn, isValidToken, userRoute)

    return app
}


module.exports = routes