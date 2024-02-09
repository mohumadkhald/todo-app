const express = require('express')
const router = express.Router()
// const path = require("path")
// const fs = require("fs")
const User = require('../models/User.js')
const { register, login } = require('../controllers/authController.js')
const { validateRegisterMiddleware } = require('../utlis/validation.js')
router.get('/', async(req, res) => {
  const users = await User.find()
  res.status(201).send(users)
})

router.post('/', validateRegisterMiddleware, register)
router.post('/login' ,login)


router.patch('/:id', async (req, res) => {
  const { email, passwd } = req.body;
  const userId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { name, passwd }, { new: true });

    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


// Get a user by ID
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


module.exports = router