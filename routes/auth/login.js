const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Facebook login route
router.route('/facebook').post( async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Verify the access token with Facebook
    const { data: { id, name, email, picture } } = await axios.get(
      `https://graph.facebook.com/v13.0/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    // Check if the user already exists in the database
    let user = await User.findOne({ facebookId: id });
    if (!user) {
      // Create a new user if not found
      user = new User({
        facebookId: id,
        name,
        email,
        picture: picture.data.url,
      });
      await user.save();
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key');

    // Send the token to the client
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;