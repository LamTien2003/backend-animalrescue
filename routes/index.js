const userRoute = require('./userRoute');
const authRoute = require('./authRoute');
const blogRoute = require('./blogRoute');
const animalRoute = require('./animalRoute');

const route = (app) => {
    app.use('/user', userRoute);
    app.use('/auth', authRoute);
    app.use('/blog', blogRoute);
    app.use('/animal', animalRoute);
};

module.exports = route;
