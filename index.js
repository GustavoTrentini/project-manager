const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  {
    "id" : "1",
    "title" : "Projeto 1",
    "tasks" : ["Iniciar projeto!"]
  },
  {
    "id" : "2",
    "title" : "Projeto 2",
    "tasks" : ["Reunião com o cliente!"]
  }
];

const countReq = {
  "count" : 0
};

server.use((req, res, next) => {
  countReq.count ++;
  console.log(countReq.count);
  next();
});

function CheckPutParams (req, res, next) {
    
  if(!req.body.title){
    res.status(500).json({ error : "O parametro {title} é obrigatório!"});
  }

  next();
}

function CheckProjectExists (req, res, next) {

  const response = projects.find((project) => {
    return project.id == req.params.id;
  });
 
  if(!response) res.status(400).json({ error : "Projeto não encontrado!" });

  next();
}

server.get('/projects', (req, res) => {

  res.json(projects);

});

server.post('/projects', (req, res) => {

  const dados = {
    "id" : req.body.id,
    "title" : req.body.title,
    "tasks" : req.body.tasks,
  };

  projects.push(dados);
  
  res.json({ success : "Projeto Cadastrado com sucesso!"});
});

server.put('/projects/:id', CheckProjectExists, CheckPutParams, (req, res) => {

  const project = projects.find((project) => {
    return project.id == req.params.id;
  });
  
  if(project){

    project.title = req.body.title;
    res.json({ success : "Projeto editado com sucesso!"});
  }
  else{

    res.status(500).json({ "error" : "Problemas ao editar o projeto!"});
  }
});

server.post('/projects/:id/tasks', CheckProjectExists, (req, res) => {

  const project = projects.find((project) => {
    return project.id == req.params.id;
  });
  
  if(project){

    project.tasks.push(req.body.task);
    res.json({ success : "Projeto editado com sucesso!"});
  }
  else{

    res.status(500).json({ "error" : "Problemas ao editar o projeto!"});
  }
  
});

server.delete('/projects/:id', CheckProjectExists, (req, res) => {
  
  projects.map(function(project, index) {
    if(project.id == req.params.id){
      projects.splice(index, 1);
    }
  });
    
  res.json({ success : "Projeto deletado com sucesso!"});
});

server.listen(5000);



