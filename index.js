const express = require('express');

const path = require('path');
const flash = require('connect-flash');
const nocache = require('nocache');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { checkAuthenication } = require('./middlware/authentication');

const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');
const Blog = require('./models/blogModel');

const app = express();
const PORT = 8000;
//Database
mongoose
  .connect('mongodb://localhost:27017/blogify')
  .then(() => console.log(`Mongodb Connected`))
  .catch((err) => console.log(err));
//configurations
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
//middlewares
app.use(
  session({
    secret: 'secret234hello',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(flash());
app.use(nocache());
app.use(cookieParser());
app.use(checkAuthenication('token'));

//routes
app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.get('/', async (req, res) => {
  if (!req.user) {
    return res.status(200).render('home.ejs');
  }
  const { _id } = req?.user;
  try {
    const blogs = await Blog.find({ createdBy: _id });
    return res.status(200).render('home.ejs', { blogs: blogs, user: req.user });
  } catch (error) {
    res.status(400).render('home.ejs', { error: error.message });
  }
});

//server listening
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
