const express = require("express")
const session = require("express-session")
const flash = require("connect-flash")
const exphbs = require("express-handlebars")
const handlebars = require("handlebars")
const filmes = require("./models/Filmes")
const Materia = require("./models/Materia")
const conn = require("./db/conn")
const filmesRoutes = require("./routes/filmesRoutes")
const cors = require("cors")



const port = 3000
const app = express()

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars")
app.use(express.urlencoded({
    extended:true
}))

app.use(cors())

app.use(express.json())
app.use(express.static("public"))



//app.use("/buscar", buscarRoutes)

app.use(session({
    secret: "meu segredo", // colocar uma string segura aqui
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

// middleware para disponibilizar as mensagens para todas as views
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
   next()
})

app.use("/", filmesRoutes);





conn.sync({alter: true}).then(() => {
    app.listen(port, () => {
        console.log("o servidor esta rodando na porta: " + port)
    })
}).catch(err => console.log("erro ao conectar ao banco: " + err))