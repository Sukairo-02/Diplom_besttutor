var isDate = function (date) {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date))
}

module.exports = function (date) {
    try {
        if (!date) {
            return false
        } else {
            if (!isDate(date)) {
                return false
            } else {
                let year = new Date(date).getFullYear() - new Date.getFullYear()
                if (year < 4) {
                    return false
                }
            }
        }
        return true
    } catch (e) {
        console.log(e)
    }
}
