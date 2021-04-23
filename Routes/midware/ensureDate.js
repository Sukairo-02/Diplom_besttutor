var isDate = function (date) {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date))
}

module.exports = function (date) {
    return function (req, res, next) {
        try {
            if (!dateOfBirth) {
                return res
                    .status(403)
                    .json({ message: "You must enter the bith date!" })
            } else {
                if (!isDate(date)) {
                    return res
                        .status(403)
                        .json({
                            message:
                                "Error: can't parse date of birth as date!",
                        })
                } else {
                    let year =
                        new Date(date).getFullYear() - new Date.getFullYear()
                    if (year < 4) {
                        return res
                            .status(403)
                            .json({
                                message:
                                    "Invalid date of birth!",
                            })
                    }
                }
            }
            next()
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: "Error occured!" })
        }
    }
}