const User = require('../models/user');

exports.get = (req, res) => {
  const userId = req.user.sub;
  User.findOne({ userId }).then((existingUser) => {
    if (!existingUser) {
      const newUser = new User({
        userId,
        interests: [],
        blacklist: [],
        history: [],
      });
      newUser.save().then(result => res.status(200).send({
        result: 'User has been created.',
        data: result,
      }));
    } else {
      return res.status(200).send({
        result: 'Returning user',
        data: existingUser,
      })
    }
  })
  .catch((error) => res.status(400).send({
    error: 'Could not get user',
  }));
}

exports.post = (req, res) => {
  const userId = req.user.sub;
  User.findOne({ userId }).then((existingUser) => {
    if (!existingUser) {
      const newUser = new User({
        userId,
        interests: req.body.interests || [],
        blacklist: req.body.blacklist || [],
        history: [],
      });
      newUser.save().then(result => res.status(200).send({
        result: 'User has been created.',
        data: result,
      }));
    } else {
      if (req.body.interests && req.body.interests.length > 0)
        existingUser.interests = req.body.interests;
      if (req.body.blacklist && req.body.blacklist.length > 0)
        existingUser.blacklist = req.body.blacklist;
      existingUser.save().then(result => res.status(200).send({
        result: 'User has been updated.',
        data: result,
      }));
    }
  })
  .catch(error => res.status(400).send({
    error: 'Could not get user',
  }));

}
