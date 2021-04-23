var isDate = function (date) {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date))
}

module.exports = async function (req, res, next) {
    try {
        const {dateOfBirth: date} = req.body
        if (!date) {
            return res.status(403).json({message:"Error: missing date of birth!"})
        } else {
            if (!isDate(date)) {
                return res.status(403).json({message:"Error: invalid date of birth!"})
            } else {
                let date1 = new Date(date)
                let date2 = new Date()
                let year = date2.getFullYear() - date1.getFullYear()

                if (year < 4) {
                    return res.status(403).json({message:"Error: invalid date of birth!"})
                }
            }
        }
        next()
    } catch (e) {
        console.log(e)
        return res.status(400).json({message:"Error occured while ensuring date of birth!"})
    }
}