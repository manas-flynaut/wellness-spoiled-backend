const auth = require("./auth")

const routes = (app) => {
    // Test Route for API
    app.get("/welcome", (req, res) => {
        res.send("Welcome to API for Wellness Spoiled")
    })

    app.use("/v1/api" , auth)

    return app
}


module.exports = routes