const express = require("express")
const router = express.Router()
const filmes = require("../models/Filmes")
const { raw } = require("mysql2")

// Rota inicial
router.get("/", async (req, res) => {
 

  try{
    const recentesBrutos = await filmes.findAll({
      order: [["ID", "DESC"]],
      limit: 3,
    });
    
    // Converter todos para objetos puros
    const recentes = recentesBrutos.map(filme => filme.get({ plain: true }));

    const destaqueBrutos  = await filmes.findOne(
      {order: [["ID", "DESC"]], 
      limit: 1})

      const destaques = await destaqueBrutos.get({plain: true})
   
    
    return res.render("home", { recentes,destaques });

    
}catch(err){
    console.log("nao foi possivel encontrar o filme!", err)
    return res.status(500).json({message: "erro ao buscar filme!"})
  }
 
})



// Criar novo filme (inserção)

router.get("/inserir", (req, res) => {
  res.render("inserir")
})


router.post("/inserir", async (req, res) => {
  const { filme, ano, diretor, elenco, sinopse, curiosidades, imagem } = req.body

   

  try {
      await filmes.create({ filme, ano, diretor, elenco, sinopse, curiosidades, imagem })
   
      req.flash("success_msg", "Filme cadastrado com sucesso!")
    
   
   
    res.redirect("/inserir")

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

// atualizar
router.get("/atualizar", (req, res) => {
    res.render("atualizar")
})

router.post("/atualizar", async(req, res) => {
  const { filme } = req.body

  try{

   const filmeBusca = await filmes.findOne({where: {filme}})

    if(!filmeBusca){
        console.log("filme nao encontrado!")
        req.flash("error_msg", "Filme não encontrado.")
    }

    //remove os campos vazios
    const camposAtualizar = {}

    for(let campo in req.body){
      if(req.body[campo] && campo !== "filme"){
          camposAtualizar[campo] = req.body[campo]
      }
    }

    // so atualiza se tiver campos para atualizar
    if(Object.keys(camposAtualizar).length === 0){
      req.flash("error_msg", "Nenhum campo para atualizar.");
      return res.redirect("/atualizar");
    }

        await filmeBusca.update(camposAtualizar)
        req.flash("success_msg", "Filme atualizado com sucesso!")
        res.redirect("/atualizar")


  }catch(error){
    console.log("erro ao atualizar!", error)
    return res.status(500).json({message: "erro ao atualizar!"})
  }
})

module.exports = router
