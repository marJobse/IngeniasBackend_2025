const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

// Carga de variables de entorno
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.static('views'));

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

// Endpoint Categoría
app.get('/categoria/:cat', (req, res) => {
  
  const cat = req.params.cat.trim().toLowerCase();
  //console.log(cat);
  const resultado = trailerflix.filter(trailerflix => trailerflix.categoria.toLowerCase() === cat);
  //console.log(resultado);

  if (resultado.length === 0) {
    const data ={
      title: 'Error 404',
      message: 'La búsqueda de la categoría ' + cat + ' no arrojo resultados. Debe buscar una de las dos categorías válidas: película o serie.'
    };
    res.render('error_404', data);
  } else {
    const data = {
      title: 'Búsqueda por categoría',
      message: 'Listado de resultados para: '+ cat,
      cat,
      resultado
    };
    res.render('categoria', data);
  }
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  const data = {
    title: 'Error 404',
    message: 'No se encuentra la ruta o el recurso solicitado.'
  };
  res.render('error_404', data);
});

// Configuración del servidor
app.listen(PORT, () => {
  console.log('Servidor iniciando en http://localhost:' + PORT);
});