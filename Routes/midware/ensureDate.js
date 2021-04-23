var isDate = function (date) {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date))
}

module.exports = function (date) {
    try {
        if (!date) {
            return false
        } else {
            if (!isDate(date)) {
                console.log(date)
                return false
            } else {
                let date1 = new Date(date)
                let date2 = new Date()
                let year = date2.getFullYear() - date1.getFullYear()

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
