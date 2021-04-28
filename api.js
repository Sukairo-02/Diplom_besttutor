const config = require("config")
const mongoose = require("mongoose")
const express = require("express")
const app = express()
app.use(express.json({ extended: true }))

const authRouter = require("./Routes/auth")
const schoolRouter = require("./Routes/school")
app.use("/api/auth", authRouter)
app.use("/api/school", schoolRouter)

const PORT = process.env.PORT || config.get("server.PORT")

const start = async () => {
    try {
        await mongoose.connect(
            config.get("mongoose.URI"),
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Database connected succesfully!")
                }
            }
        )

        app.listen(PORT, () => {
            console.log(`Server has been started at port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start()
