const { loggerUtil } = require("../utils/logger")
const { isSignedIn, isValidToken } = require("../middleware/index")
const auth = require("./auth")
const userRoute = require("./user")
const roleRoute = require("./role")
const adminRoute = require("./admin")
const notificationRoute = require("./notification")
const reminderRoute = require("./reminder")
const careNotesRoute = require("./careNotes")

const routes = (app) => {
    // Test Route for API
    app.get("/welcome", (req, res) => {
        loggerUtil("Welcome API called.")
        res.send("Welcome to API for Wellness Spoiled.\n Servers are Up and Running")
    })

    app.use("/api/v1", auth)
    app.use('/api/v1', isSignedIn, isValidToken, userRoute)
    app.use("/api/v1", isSignedIn, isValidToken, notificationRoute)
    app.use("/api/v1", isSignedIn, isValidToken, reminderRoute)
    app.use('/api/v1', isSignedIn, isValidToken, careNotesRoute)
    app.use('/api/v1', isSignedIn, isValidToken, roleRoute)
    app.use('/api/v1', isSignedIn, isValidToken, adminRoute)

    return app
}


module.exports = routes