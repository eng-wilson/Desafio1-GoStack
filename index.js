const express = require("express");

const server = express();

server.use(express.json());

const routes = {
  counter: 0
};

const projects = [
  {
    id: "1",
    title: "Fazer café",
    tasks: []
  },
  {
    id: "2",
    title: "EStudar node",
    tasks: []
  },
  {
    id: "3",
    title: "Estudar react",
    tasks: []
  }
];

function idNotFound(req, res, next) {
  const { id } = req.params;

  if (!projects.find(p => p.id === id)) {
    return res.status(400).json("ID not found");
  }

  next();
}

function routesCounter(req, res, next) {
  routes.counter++;

  console.log(req.method, routes.counter);

  next();
}

server.get("/projects", routesCounter, (req, res) => {
  return res.json(projects);
});

server.post("/projects", routesCounter, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.post("/projects/:id/tasks", routesCounter, idNotFound, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const index = projects.findIndex(project => project.id === id);

  projects[index].tasks.push(title);

  return res.json(projects);
});

server.put("/projects/:id", routesCounter, idNotFound, (req, res) => {
  const { title } = req.body;

  projects.map(project => {
    if (project.id === req.params.id) {
      project.title = title;
    }
  });

  return res.json(projects);
});

server.delete("/projects/:id", routesCounter, idNotFound, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);

  return res.json(projects);
});

server.listen(3000);
