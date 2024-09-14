const { Router } = require('express');
const Blog = require('../models/blogModel');
const upload = require('../services/Storage');

const router = Router();

router.get('/add-new', (req, res) => {
  return res.render('new-blog.ejs', { user: req.user });
});

router.post('/add-new', upload.single('coverImg'), async (req, res) => {
  const {
    body: { title, body },
    file: { filename },
    user: { _id },
  } = req;

  try {
    const blog = await Blog.create({
      title,
      body,
      coverImgURL: `/uploads/${filename}`,
      createdBy: _id,
    });
    res.status(200).redirect(`/blog/${blog._id}`);
  } catch (error) {
    console.log(error);
    res.status(400).render('new-blog.ejs');
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById({ _id: id });
    res.status(400).render('blogs.ejs', { blog, user: req.user });
  } catch (error) {}
});

module.exports = router;
