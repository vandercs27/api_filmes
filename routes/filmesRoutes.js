const express = require("express")
const router = express.Router()
const filmes = require("../models/Filmes")

// Rota inicial - formulário de inserção
router.get("/", (req, res) => {
  res.render("inserir")
})

// Criar novo filme (inserção)
router.post("/inserir", async (req, res) => {
  const { filme, ano, diretor, elenco, sinopse, curiosidades, imagem } = req.body

  try {
    await filmes.create({ filme, ano, diretor, elenco, sinopse, curiosidades, imagem })
    req.flash("success_msg", "Filme cadastrado com sucesso!")
    res.redirect("/")
  } catch (err) {
    console.log("Erro ao adicionar filme:", err)
    req.flash("error_msg", "Erro ao cadastrar filme.")
    res.redirect("/")
  }
})

// Listar todos os filmes
router.get("/listar", async (req, res) => {
  

  try {
    const listaFilmes = await filmes.findAll({ raw: true })
  
    res.render("listar", { listaFilmes })
  } catch (err) {
    console.log("Erro ao listar filmes:", err)
   return res.redirect("/listar")
  }
})

// Formulário de busca
router.get("/buscar", (req, res) => {
  res.render("buscar")
})

// Buscar filme pelo título
router.post("/buscar", async (req, res) => {
  const { filme } = req.body
  

  try {
    const filmeEncontrado = await filmes.findOne({ where: { filme }, raw: true })

    if (filmeEncontrado) {
    
     return res.render("buscar", { filmeEncontrado })
      
    } else {
      req.flash("error_msg", "Filme não encontrado.")
      res.redirect("/buscar")
    }
  } catch (err) {
    console.log("Erro ao buscar filme:", err)
    res.redirect("/buscar")
  }
})



//deletar
router.get("/deletar", (req, res) => {
  res.render("deletar")
})

// Excluir filme
router.post("/deletar", async (req, res) => {
  const { filme} = req.body

  const filmeBusca = await filmes.findOne({where: {filme}})
  if(!filmeBusca){
    console.log("filme nao encontrado!")
    req.flash("error_msg", "Filme não encontrado.")
    return res.redirect("/deletar")
  }
  try {
    await filmes.destroy({ where: {filme } })
    req.flash("success_msg", "Filme deletado com sucesso!")
    res.redirect("/deletar")
  } catch (err) {
    console.log("Erro ao deletar filme:", err)
    res.redirect("/deletar")
  }
})

module.exports = router
