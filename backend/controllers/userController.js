const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      status: true,
      message: 'User profile fetched successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong while fetching profile',
      error: err.message,
    });
    console.log(err)
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatedData = { name: req.body.name };
 if (req.file) {
  updatedData.profilePicture = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
}
    const user = await User.findByIdAndUpdate(req.userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Something went wrong while updating profile',
      error: err.message,
    });
  }
};

module.exports = { getProfile, updateProfile };
