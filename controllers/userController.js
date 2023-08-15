const User  = require('../models/User');

module.exports = {
  // Get all users
  async getAllUser(req, res) {
    try {
      const user = await User.find().select('-__v');

      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a single user
  async getUserById(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })

        .populate({ path: "thought", select: "-__v" })
        .populate({ path: "friends", select: "-__v" });

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //update user 
  async updateUser (req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId }, 
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'No user with this id!' });
      }
      res.json(user);
    }catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a user by ID
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No such user exists' });
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a friend to a user
  async addFriend(req, res) {
    console.log('You are adding a friend');
    console.log(req.body);

    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!friend) {
        return res
          .status(404)
          .json({ message: 'No friend found with that ID :(' });
      }

      res.json(friend);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove friend from a user
  async removeFriend(req, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!friend) {
        return res.status(404).json({ message: 'No friend found with that ID' });
      }

      res.json('Friend has been removed');
    } catch (err) {
      res.status(500).json(err);
    }
  },
};