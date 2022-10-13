const allowedCors = [
  'https://kazarinov.mesto.nomoredomains.icu/',
  'http://kazarinov.mesto.nomoredomains.icu/',
  'localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};
