const express = require('express');
const qr = require('qr-image');
const path = require('path');

const app = express();
const port = process.env.PORT ?? 1234;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/generar-qr', (req, res) => {
  const { text, size } = req.query;

  // Verificar si el texto y el tamaño están presentes
  if (!text || !size) {
    return res.status(400).send('El texto y el tamaño son requeridos');
  }

  // Verificar si el tamaño es un número
  const sizeNumber = parseInt(size, 10);
  if (isNaN(sizeNumber) || sizeNumber <= 0) {
    return res.status(400).send('El tamaño debe ser un número positivo');
  }

  try {
    const qr_svg = qr.image(text, { type: 'svg', size: sizeNumber });
    res.type('svg');
    qr_svg.pipe(res);
  } catch (error) {
    res.status(500).send('Error generando QR: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});