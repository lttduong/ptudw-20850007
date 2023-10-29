'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expresssHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');

//  Cau hinh public static folder
app.use(express.static(__dirname + '/public'));

//  Cau hinh su dung express handlebars
app.engine('hbs', expresssHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        createStarList,
        createPagination
    }
}))
app.set('view engine', 'hbs');
//  Cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cau hinh su dung session
app.use(session({
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 //20ph
    }
}));

//  Middleware khoi tao gio hang
app.use((req, res, next) => {
    let Cart = require('./controllers/cart')
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity = req.session.cart.quantity;
    next();
})
// Routes
app.use('/', require('./routes/indexRouter'));

app.use('/products', require('./routes/productsRouter'))
app.use('/users', require('./routes/usersRouter'))

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'File not Found!' });
});

app.use((error, req, res, next ) => {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error'});
});

// app.get('/', (req, res) => {
//     res.send('Hello to Eshop');
// });

// khoi dong web server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})