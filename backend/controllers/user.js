import User from "../models/user.js";

async function getUser(req, res) {}

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

async function removeUser(req, res) {}

export default {
  getUser,
  updateUser,
  removeUser,
};
