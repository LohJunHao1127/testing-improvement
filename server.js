require('dotenv').config();
const http = require('./app');

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`listening on *:${port}`);
});