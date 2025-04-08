const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Base de datos en memoria: Solo materias
let materias = [];

// Servir archivos estáticos desde 'client/public'
app.use(express.static(path.join(__dirname, "client", "public")));

// Ruta raíz para el frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

// Endpoint GET: Devuelve todas las materias
app.get("/materias", (req, res) => {
  res.json(materias);
});

// Endpoint GET individual: Devuelve una materia por ID
app.get("/materias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const materia = materias.find(m => m.id === id);
  if (materia) {
    res.json(materia);
  } else {
    res.status(404).json({ error: "Materia no encontrada" });
  }
});

// Endpoint POST: Crea una nueva materia
app.post("/materias", (req, res) => {
  // Se espera que se envíe la información de la materia directamente
  const nuevaMateria = { ...req.body, id: Date.now() };
  materias.push(nuevaMateria);
  res.status(201).json(nuevaMateria);
});

// Endpoint PUT: Actualiza una materia existente
app.put("/materias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = materias.findIndex(materia => materia.id === id);
  if (index !== -1) {
    materias[index] = { ...materias[index], ...req.body };
    res.json(materias[index]);
  } else {
    res.status(404).json({ error: "Materia no encontrada" });
  }
});

// Endpoint DELETE: Elimina una materia
app.delete("/materias/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const prevLength = materias.length;
  materias = materias.filter(materia => materia.id !== id);
  if (materias.length < prevLength) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: "Materia no encontrada" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});