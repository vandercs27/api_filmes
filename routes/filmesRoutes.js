const express = require("express")
const router = express.Router()
const { Sequelize } = require("sequelize");
const filmes = require("../models/Filmes")
const Destaque = require("../models/Destaque")
const Materia = require("../models/Materia")
const { raw } = require("mysql2");


// Rota inicial
router.get("/", async (req, res) => {
 

  try{
    //recentes
    const recentesBrutos = await filmes.findAll({
      order: [["ID", "DESC"]],
      limit: 5,
    });
    
    // Converter todos para objetos puros
    const recentes = recentesBrutos.map(filme => filme.get({ plain: true }));
  
    //destaques
    const destaqueBrutos  = await Destaque.findOne(
      {order: [["ID", "desc"]]})

      const destaques = destaqueBrutos
      ? destaqueBrutos.get({plain: true})
      : null

    //materias
     const materiaBruta = await Materia.findAll({
      order: [["ID", "DESC"]],
      limit: 3,
    });
    
    // Converter todos para objetos puros
    const materias = materiaBruta.map(filme => filme.get({ plain: true }));
      
      res.render("home", { recentes, materias, destaques });
     

    
}catch(err){
    console.log("nao foi possivel encontrar o filme!", err)
    return res.status(500).json({message: "erro ao buscar filme!"})
  }
 
})

// destaque
router.get("/destaque", ( req, res ) => {
  res.render("destaque")
})

router.post("/destaque", async ( req, res) => {
     const { filme, ano, diretor, elenco, sinopse, curiosidades,comentarios, materia, imagem } = req.body


  try{
        const destaques = await Destaque.findOne()
     if(!destaques){
      console.log("filme não encontrado!")
      req.flash("error_msg", "filme não encontrado!")
     
     }

      await Destaque.create({ filme, ano, diretor, elenco, sinopse, curiosidades,comentarios,materia, imagem } )

  }catch(error){
    console.log("erro ao buscar filme", error)
    req.flash("error_msg", "erro ao buscar destaque!")
    res.redirect("/destaque")
  }
})

// deletar destaque
router.get("/deletarDestaque", (req, res) => {
  res.render("deletarDestaque")
})

// Excluir filme
router.post("/deletarDestaque", async (req, res) => {
  const { filme} = req.body

  const filmeBusca = await Destaque.findOne({where: {filme}})
  if(!filmeBusca){
    console.log("filme nao encontrado!")
    req.flash("error_msg", "Filme não encontrado.")
    return res.redirect("/deletarDestaque")
  }
  try {
    await Destaque.destroy({ where: {filme } })
    req.flash("success_msg", "Filme deletado com sucesso!")
    res.redirect("/deletar")
  } catch (err) {
    console.log("Erro ao deletar filme:", err)
    res.redirect("/deletarDestaque")
  }
})

// Criar novo filme (inserção)

router.get("/inserir", (req, res) => {
  res.render("inserir")
})


router.post("/inserir", async (req, res) => {
  const { filme, ano, diretor, elenco, sinopse, curiosidades,comentarios, imagem } = req.body

   

  try {
      await filmes.create({ filme, ano, diretor, elenco, sinopse, curiosidades,comentarios, imagem })
   
      req.flash("success_msg", "Filme cadastrado com sucesso!")
    
   
   
    res.redirect("/inserir")

  } catch (err) {
    console.log("Erro ao adicionar filme:", err)
    req.flash("error_msg", "Erro ao cadastrar filme.")
    res.redirect("/")
  }
})

// materias filmes

router.get("/materia", (req, res) => {
   res.render("materia",{
      success_msg: req.flash("success_msg"),
     error_msg: req.flash("error_msg")
   })
})

router.post("/materia", async (req, res) => {
  const { filme, ano, diretor, elenco, sinopse, curiosidades,comentarios,materia, imagem } = req.body
  console.log("dados recebidos: ", req.body)

  try{
      
  const materiaExistente = await Materia.findOne({
    where: Sequelize.where(
    Sequelize.fn("LOWER", Sequelize.col("filme")),
    Sequelize.fn("LOWER", filme)
    
  )
  
});


      if(materiaExistente){
        console.log("Filme já existe no banco:", materiaExistente);
        console.log("essa materia ja foi criada!")
        req.flash("error_msg", "essa materia ja foi criada.")
        return res.redirect("materia")
      }
       
        await Materia.create( { filme, ano, diretor, elenco, sinopse, curiosidades,materia, comentarios, imagem })
      
        
        const todasMaterias = await Materia.findAll()
        const materiasLimpas = todasMaterias.map(f => f.get({plain: true}))
      
         res.render("home", { materias: materiasLimpas})
     

 

  }catch(error){
    console.log("erro ao cadastrar materia", error)
    req.flash("error_msg", "Erro ao cadastrar materia.")
   
  }
})



// Listar todos os filmes
router.get("/listar", async (req, res) => {
  

  try {
    const listaFilmes = await filmes.findAll({raw: true},{order: [["id","desc"]] })
    
  
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
    const filmeDestaque = await Destaque.findOne({ where: { filme }, raw: true })
    const filmeMateria = await Materia.findOne({ where: { filme }, raw: true })
   

    if (filmeEncontrado || filmeDestaque || filmeMateria) {
     console.log(filmeEncontrado.comentarios)
     return res.render("buscar", { filmeEncontrado, filmeDestaque, filmeMateria })
      
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

// deletar materias
router.get("/deletarMateria", ( req, res ) => {
  res.render("deletarMateria")
})
router.post("/deletarMateria", async (req, res) => {
  const { filme} = req.body

  const materiaBusca = await Materia.findOne({where: {filme}})
  if(!materiaBusca){
    console.log("materia nao encontrada!")
    req.flash("error_msg", "materia não encontrada.")
    return res.redirect("/deletar")
  }
  try {
    await Materia.destroy({ where: {filme } })
    req.flash("success_msg", "materia deletada com sucesso!")
    res.redirect("/deletarMateria")
  } catch (err) {
    console.log("Erro ao deletar materia:", err)
    res.redirect("/deletarMateria")
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


// atualizar materia
router.get("/atualizarMateria", (req, res) => {
    res.render("atualizarMateria")
})

router.post("/atualizarMateria", async(req, res) => {
  const { filme } = req.body

  try{

   const materiaBusca = await Materia.findOne({where: {filme}})

    if(!materiaBusca){
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
      return res.redirect("/atualizarMateria");
    }

        await materiaBusca.update(camposAtualizar)
        req.flash("success_msg", "Filme atualizado com sucesso!")
        res.redirect("/atualizarMateria")


  }catch(error){
    console.log("erro ao atualizar a materia!", error)
    return res.status(500).json({message: "erro ao atualizar materia!"})
  }
})


module.exports = router
