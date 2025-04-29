const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// Carga de variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
app.use(express.static(path.join(__dirname, "trailerflix_grupo4")));

// Leer el archivo de forma síncrona
const trailerData = fs.readFileSync("database/trailerflix.json", "utf-8");

// Convertir el contenido (string) a objeto
const trailerflix = JSON.parse(trailerData);
//console.log("catalogo trailerflix ", trailerflix);

//http://localhost:3008/catalogo
app.get("/catalogo", (req, res) => {
  const data = {
    title: "Bienvenido a Trailerflix",
    message: "Listado de peliculas y series",
    catalogo: trailerflix,
  };
  res.json(data);
});

//http://localhost:3008/titulo/:title
app.get("/titulo/:title", (req, res) => {
  const parametro = req.params.title.trim().toLowerCase();
  console.log(parametro);
  const resultado = trailerflix.filter((trailerflix) =>
    trailerflix.titulo.toLowerCase().includes(parametro)
  );

  if (resultado.length === 0) {
    res.json({
      error: 404,
      message: "La búsqueda del titulo " + parametro + " no arrojo resultados",
    });
  }
  const data = {
    title: "Resultado de su búsqueda- Titulos que contienen: " + parametro,
    resultado: resultado,
  };
  res.json(data);
});

=======
>>>>>>> f4382bc30fb5ce8eda3088dd98e97d542785d567
// Manejo de rutas inexistentes
app.use((req, res) => {
  res.json({
    error: 404,
    message: "No se encuentra la ruta o el recurso solicitado.",
  });
});

// Configuración del servidor
app.listen(PORT, () => {
  console.log("Servidor iniciando en http://localhost:" + PORT);
});
