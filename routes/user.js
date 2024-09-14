const { Router } = require('express');
const User = require('../models/userModel');

const router = Router();

router.get('/signin', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  return res.render('signin.ejs');
});

router.post('/signin', async (req, res) => {
  const {
    body: { email, password },
  } = req;
  //checking password
  try {
    const token = await User.comparePasswordAndGenerateToken(email, password);
    return res.cookie('token', token).redirect('/');
  } catch (error) {
    return res.render('signin.ejs', { error: error.message });
  }
});

router.get('/signup', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  return res.render('signup.ejs');
});

router.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;
  //adding new user to database
  await User.create({
    fullname,
    email,
    password,
  });

  return res.redirect('/');
});

router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/');
});

module.exports = router;
