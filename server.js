const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// Carga de variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.static("views"));

// Leer el archivo de forma síncrona
const trailerData = fs.readFileSync("database/trailerflix.json", "utf-8");

// Convertir el contenido (string) a objeto
const trailerflix = JSON.parse(trailerData);
//console.log("catalogo trailerflix ", trailerflix);

// Ruta raíz
app.get("/", (req, res) => {
  res.send(`
    <p>👋 Bienvenida en la Raíz ("/").</p>
    <p>🔗 Endpoint <a href="/reparto/actriz">/reparto/:act</a></p>
    <p>🔗 Endpoint <a href="/trailer/1">/trailer/:id</a></p>
  `);
});

//http://localhost:3008/reparto
app.get("/reparto/:act", (req, res) => {
  const actorBuscado = req.params.act.trim().toLowerCase();
  const resultados = trailerflix.filter(
    (item) => item.reparto && item.reparto.toLowerCase().includes(actorBuscado)
  );

  if (resultados.length > 0) {
    res.json(
      resultados.map((p) => ({
        id: p.id,
        titulo: p.titulo,
        reparto: p.reparto,
      }))
    );
  } else {
    res.status(404).json({ mensaje: "Actor no encontrado." });
  }
});

//http://localhost:3008/trailer
app.get("/trailer/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const resultado = trailerflix.find((item) => item.id === id);

  if (resultado) {
    res.json({
      id: resultado.id,
      titulo: resultado.titulo,
      trailer: resultado.trailer,
    });
  } else {
    res.status(404).json({ mensaje: "Película o serie no encontrada." });
  }
});

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

// Endpoint Categoría
app.get("/categoria/:cat", (req, res) => {
  const cat = req.params.cat.trim().toLowerCase();
  //console.log(cat);
  const resultado = trailerflix.filter(
    (trailerflix) => trailerflix.categoria.toLowerCase() === cat
  );
  //console.log(resultado);
  let data = {};

  if (resultado.length === 0) {
    data = {
      title: "Error 404",
      message: "La categoría " + cat + " no existe o está vacía.",
    };
    res.render("error_404", data);
  } else {
    data = {
      title: "Búsqueda por categoría",
      message: "Listado de resultados para: " + cat,
      cat,
      resultado,
    };
    res.render("categoria", data);
  }
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  const data = {
    title: "Error 404",
    message: "No se encuentra la ruta o el recurso solicitado.",
  };
  res.render("error_404", data);
});

// Configuración del servidor
app.listen(PORT, () => {
  console.log("Servidor iniciando en http://localhost:" + PORT);
});
