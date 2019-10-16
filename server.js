const express = require("express");

const server = express();

// Armazena o número de requisições
let numReqs = 0;

// Array de projetos
const projects = [];

// Necessário para que possa receber dados JSOn no body request
server.use(express.json());

// Adiciona o middleware para atualizar e imprimir a contagem do total de
// requisições realizadas
server.use(updateAndShowNumberRequests);

//Cria a rota para obter todos os projetos cadastrados
server.get("/projects", (request, response) => {
  return response.json(projects);
});

// Cria a rota pra criar um novo projeto
server.post("/projects", (resquest, response) => {
  const { id, title } = resquest.body;

  // Adiciona o novo projeto e apresenta a listagem de projetos atualizada
  addProject(id, title);
  return response.status(201).json(projects);
});

// Cria a rota para atualizar o titulo de um projeto
server.put("/projects/:id", verifyProject, (request, response) => {
  // Obtém o id do projeto e o novo titulo
  const { id } = request.params;
  const { title } = request.body;

  // Obtem o índice do projeto no array de projetos
  const index = projectIndex(id);

  // Atualiza e retorna o projeto atualizado
  updateTitleProject(id, title);
  return response.status(200).json(projects[index]);
});

// Cria a rota para adicionar uma tarefa ao um determinado projeto
server.post("/projects/:id/tasks", verifyProject, (request, response) => {
  // Obtem o id do projeto e o titulo da tarefa a ser adicionada ao projeto
  const { id } = request.params;
  const { title } = request.body;

  // Obtem o índice do projeto no array de projetos
  const index = projectIndex(id);

  // Adiciona tarefa ao projeto e apresenta o projeto atualizado
  addTaskToProject(id, title);
  return response.status(200).json(projects[index]);
});

// Cria a rota para deletar um projeto
server.delete("/projects/:id", verifyProject, (request, response) => {
  // Obtem o id do projeto a ser deletado
  const { id } = request.params;

  // Obtém o indice do projeto no array de projetos
  const index = projectIndex(id);

  projects.splice(index, 1);
  return response
    .status(200)
    .json({ mensagem: `Project id ${id} has been deleted!` });
});

server.listen(3030);

// Middlewares

// Middleware para realizar a contagem dos números de requisições realizadas
function updateAndShowNumberRequests(request, response, next) {
  next();
  numReqs++;
  console.log(`Total of ${numReqs} requests until now!`);
}

// Middleware para verificar se o projeto existe
function verifyProject(request, response, next) {
  const { id } = request.params;

  if (!projectExists(id)) {
    return response.status(400).json({ error: `Project id ${id} not found!` });
  }

  next();
}

// Funçõe auxiliares

// Função para retornar o indice do projeto no array projetos, caso exista
function projectIndex(id) {
  return projects.findIndex(project => project.id === id);
}

// Função que verifica se o projeto já existe, baseado no id do projeto
function projectExists(id) {
  return projectIndex(id) !== -1;
}

// Função para adicionar um projeto ao array de projetos
function addProject(id, title) {
  const project = { id, title, tasks: [] };
  projects.push(project);
}

// Função para atualizar o titulo de um projeto
function updateTitleProject(id, title) {
  const index = projectIndex(id);
  projects[index].title = title;
}

// Função para adicionar uma tarefa a um projeto
function addTaskToProject(id, title) {
  const index = projectIndex(id);
  projects[index].tasks.push(title);
}
