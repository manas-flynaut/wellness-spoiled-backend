

const signUp = async (req, res) => {
    try {
        res.send("Regiester")
    } catch (err) {
        logger(err, 'ERROR')
    } finally {
        logger(`Sign up API called by user - ${email}`)
    }
}

module.exports = { signUp }