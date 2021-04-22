const config = require('config')

module.exports = function (date) {

    return  function(req, res, next){
        try {

            if (!token)
            {
                return res
                .status(403)
                .json({message: "You must enter the bith date!"})
            }
    
            next()
        } catch (e) {
            console.log(e)
            return res
            .status(403)
            .json({message: "Error occured!"})
        }
    }
}