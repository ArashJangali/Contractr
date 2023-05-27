import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    user_id: String,
    googleId: String,
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    job_title: String,
    rate: String,
    novice: Boolean,
    skilled: Boolean,
    expert: Boolean,
    url: String,
    about: String,
    country: String,
    region: String,
    connects: [],
    unmatched: [],
    disliked: []
  })

  const User = mongoose.model("User", userSchema);

  export default User;