/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// express
const app = express();
var corsOptions = {
  origin: 'http://localhost:8081',
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// db
const db = require('./models');
const dbConfig = require('./config/db.config');
const Role = db.role;
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    initialize();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

async function initialize() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      const result = await Promise.allSettled(
        ['user', 'admin', 'moderator'].map(async (role) => await Role({ name: role }).save())
      );

      result.map((res) =>
        console.log(res.status === 'fulfilled' ? `${res.value.name} role added` : `${res.value.name} role not added`)
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome All.' });
});
// routes
require('./routes/auth.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
