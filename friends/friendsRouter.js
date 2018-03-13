const express = require('express');
const Friend = require('./friendsModel.js');
const friendsRouter = express.Router();

friendsRouter.get('/', (req, res) => {
  Friend.find({})
    .then(friends => {
      res.status(200).json(friends);
    })
    .catch(err => {
      res.status(500).json({ err: 'The information cannot be retrieved' });
    });
});

friendsRouter.post('/', (req, res) => {
  const newFriend = req.body;
  const { firstName, lastName, age } = req.body;
  if (!firstName || !lastName || !age) {
    res.status(400).json({
      errorMessage:
        'Please provide firstName, lastName and age for the friend.',
    });
  }
  if (age < 1 || 120 < age) {
    res
      .status(400)
      .json({ errorMessage: 'Age must be a whole number between 1 and 120.' });
  }
  const friend = new Friend(newFriend);
  friend
    .save()
    .then(savedFriend => {
      res.status(201).json(savedFriend);
    })
    .catch(err => {
      res.status(500).json({
        msg: 'There was an error while saving the friend to the database.',
        err: err,
      });
    });
});

friendsRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  Friend.findById(id)
    .then(friend => {
      if (!friend) {
        res
          .status(404)
          .json({ err: 'The friend with the specified ID does not exist' });
      }
      res.status(201).json(friend);
    })
    .catch(err => {
      res.status(500).json({ err: 'The information could no be retrieved' });
    });
});

friendsRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  Friend.findByIdAndRemove(id)
    .then(deletedFriend => {
      if (!deletedFriend) {
        res
          .status(404)
          .json({ err: 'The friend with the specified ID does not exist' });
      }
      res.status(201).json(deletedFriend);
    })
    .catch(err => {
      res.status(500).json({ err: 'The friend could not be removed' });
    });
});

module.exports = friendsRouter;
