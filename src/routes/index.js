const auth = require("./auth")

const routes = (app) => {
    // Test Route for API
    app.get("/welcome", (req, res) => {
        res.send("Welcome to API")
    })

    app.use("/" , auth)

    return app
}


module.exports = routes