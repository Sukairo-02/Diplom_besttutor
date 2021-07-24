const config = require("config")
const mongoose = require("mongoose")
const express = require("express")
const path = require("path")
const app = express()
app.use(express.json({ extended: true }))
app.use(express.static(path.join(__dirname, 'build')))

const authRouter = require("./Routes/auth")
const schoolRouter = require("./Routes/school")
app.use("/api/auth", authRouter)
app.use("/api/school", schoolRouter)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

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
