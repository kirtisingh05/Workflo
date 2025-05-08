import User from "../models/user.js";

async function me(req, res) {
  try {
    const userId = req.user_id;
    const user = await User.get({ _id: userId });
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting current user", error: error.message });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const { username, email, profilePicture } = req.body;

  console.log(username);

  try {
    const data = { username, email, profilePicture };
    const updatedUser = await User.update(id, data);

    res
      .status(200)
      .json({ data: updatedUser, message: `Updated user with id ${id}` });
  } catch (error) {
    res.status(500).json({ message: "Error while updating user" });
  }
}

async function removeUser(req, res) {
  const { id } = req.params;

  try {
    const removedUser = await User.remove(id);
    if (!removedUser) {
      return res.status(404).json({ message: `User with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: removedUser, message: `Removed user with id ${id}` });
  } catch (error) {
    res.status(500).json({ message: "Error while removing user" });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const userDoc = await User.get({ _id: id });
    const user = userDoc[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only send non-sensitive user data
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user details" });
  }
}

export default {
  me,
  updateUser,
  removeUser,
  getUser,
};
