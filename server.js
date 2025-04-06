const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Simulación de base de datos en memoria
let estudiante = {
  perfil: {
    usuario: "string",
    email: "string",
    password: "string",
    preferenciasNotificacion: {
      canal: ["email", "whatsapp"],
      anticipacionDias: 3,
    },
  },
  materias: [
    // Este arreglo se llenará con las materias enviadas desde el cliente
  ],
};

// Servir archivos estáticos desde la carpeta 'client/public'
app.use(express.static(path.join(__dirname, "client", "public")));

// Ruta raíz explícita para el frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "public", "index.html"));
});

// Endpoint GET: Obtener todas las materias
app.get("/materias", (req, res) => {
  res.json(estudiante.materias);
});

// Endpoint POST: Crear nuevas materias o procesar un objeto 'estudiante'
app.post("/materias", (req, res) => {
  const data = req.body;

  // Si el objeto enviado contiene 'estudiante' con 'materias'
  if (data.estudiante && data.estudiante.materias) {
    const nuevasMaterias = data.estudiante.materias.map((materia) => ({
      ...materia,
      id: Date.now() + Math.random(), // Generar un ID único para cada materia
    }));

    // Agregar todas las materias al arreglo existente
    estudiante.materias.push(...nuevasMaterias);

    // Enviar una respuesta indicando que las materias fueron procesadas
    return res
      .status(201)
      .json({ message: "Materias añadidas con éxito", nuevasMaterias });
  }

  // Si se envía una sola materia directamente
  const nuevaMateria = { ...data, id: Date.now() };
  estudiante.materias.push(nuevaMateria);

  // Responder con la nueva materia
  res.status(201).json(nuevaMateria);
});

// Endpoint PUT: Actualizar una materia existente
app.put("/materias/:id", (req, res) => {
  const id = parseFloat(req.params.id); // Asegurarse de que se procesen IDs correctamente
  const index = estudiante.materias.findIndex((materia) => materia.id === id);

  if (index !== -1) {
    estudiante.materias[index] = { ...estudiante.materias[index], ...req.body };
    res.json(estudiante.materias[index]);
  } else {
    res.status(404).json({ error: "Materia no encontrada" });
  }
});

// Endpoint DELETE: Eliminar una materia
app.delete("/materias/:id", (req, res) => {
  const id = parseFloat(req.params.id); // Asegurarse de que se procesen IDs correctamente
  const prevLength = estudiante.materias.length;

  estudiante.materias = estudiante.materias.filter(
    (materia) => materia.id !== id
  );

  if (estudiante.materias.length < prevLength) {
    res.sendStatus(204); // 204 No Content
  } else {
    res.status(404).json({ error: "Materia no encontrada" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});