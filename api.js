const config = require("config")
const mongoose = require("mongoose")
const express = require("express")
const app = express()
app.use(express.json())

const authRouter = require('./Routes/auth')
app.use('/api/auth', authRouter)


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
                if(err) {
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