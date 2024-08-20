import mongoose, { Schema } from "mongoose";
import User from './RegisteredUser.js'

const RoleSchema = new Schema(
  {
    role_name: {
      type: String,
      require: true,
      unique: true,
    },
  },
  { timestamps: true, collection: "Role" }
);

const Role = mongoose.model("Role", RoleSchema);
export default Role;
