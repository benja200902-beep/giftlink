const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Configuración desde variables de entorno
const REDIRECT_URL_BASE = process.env.REDIRECT_URL_BASE;
const PRODUCT_DOMAIN = process.env.PRODUCT_DOMAIN;
const PRODUCT_PATH = process.env.PRODUCT_PATH;
const PRODUCT_URL_BASE = PRODUCT_DOMAIN + PRODUCT_PATH;

// Configura EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'gift'));

// Validación básica de código (puedes mejorarla según tu lógica real)
function isValidGiftCode(gift) {
  // Ejemplo: debe tener formato producto-codigo16
  return /^[a-z0-9\-]+-[a-z0-9]{16}$/.test(gift);
}

// Middleware de log de accesos
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Acceso: ${req.method} ${req.originalUrl} desde ${req.ip}`);
  next();
});

// Ruta para servir redeem.html como plantilla EJS
app.get('/redeem/:gift', (req, res) => {
  const { gift } = req.params;
  if (!isValidGiftCode(gift)) {
    return res.status(400).send('Código de regalo inválido.');
  }
  res.render('redeem', {
    REDIRECT_URL_BASE,
    PRODUCT_DOMAIN,
    PRODUCT_PATH,
    PRODUCT_URL_BASE
  });
});

// Ruta para el checkout (redirección final)
app.get('/checkout', (req, res) => {
  const giftCode = req.query.gift;
  if (giftCode && isValidGiftCode(giftCode)) {
    // Redirigir a la URL real de tebex
    res.redirect(`${REDIRECT_URL_BASE}${giftCode}`);
  } else {
    res.status(400).send('Código de regalo inválido.');
  }
});

// Servir archivos estáticos (por ejemplo, CSS, imágenes, otros HTML)
app.use(express.static(path.join(__dirname, 'gift')));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Dominio de producto: ${PRODUCT_DOMAIN}`);
  console.log(`Path de producto: ${PRODUCT_PATH}`);
  console.log(`Dominio de redirección: ${REDIRECT_URL_BASE}`);
});
