const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thought = await Thought.find().select('-__v');

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Get a single thought
  async getThoughtById(req, res) {
    console.log(req.params)
    try {
      const thought = await Thought.findOne({ _id: req.params.id });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' })
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.username },
        { $addToSet: { thought: thought._id } },
        { runValidators: true, new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //update thought 
  async updateThought (req, res) {
    console.log(req.body)
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.id }, 
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'No thought with this id!' });
      }
      res.json(thought);
    }catch (err) {
      res.status(500).json(err);
    }
  },

  // Delete a thought by ID
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.id });

      if (!thought) {
        return res.status(404).json({ message: 'No such thought exists' });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add a reaction to a thought
    async  addReaction (req, res) {
    console.log(req.params);
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res
          .status(404)
          .json({ message: 'No reaction found with that ID' });
      }

      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove reation
  async removeReaction(req, res) {
    console.log(req.params);
    try {
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { reactions: req.body} },
        { runValidators: true, new: true }
      );

      if (!reaction) {
        return res
          .status(404)
          .json({ message: 'No reaction found with that ID :(' });
      }

      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};