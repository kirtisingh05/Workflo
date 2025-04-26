import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatarUrl: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function create(userData) {
  try {
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function findById(id) {
  try {
    const user = await User.findById(id).select("-password");
    return user;
  } catch (error) {
    throw new Error(`Error finding user by id: ${error.message}`);
  }
}

async function findOne(query) {
  try {
    const user = await User.findOne(query);
    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
}

async function update(id, updateData) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

async function remove(id) {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}

async function updatePassword(id, newPassword) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    user.password = newPassword;
    await user.save();
    return true;
  } catch (error) {
    throw new Error(`Error updating password: ${error.message}`);
  }
}

async function generateResetToken(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire time to 30 minutes
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    await user.save();
    return resetToken;
  } catch (error) {
    throw new Error(`Error generating reset token: ${error.message}`);
  }
}

export default {
  create,
  findById,
  findOne,
  update,
  remove,
  updatePassword,
  generateResetToken,
};
