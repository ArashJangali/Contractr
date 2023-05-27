import mongoose from "mongoose";

const clientUsers = mongoose.Schema({
    client_user_id: String,
    googleId: String,
    email: String,
    password: String,
    client_first_name: String,
    client_last_name: String,
    client_talent: String,
    client_rate: String,
    client_experience: String,
    client_url: String,
    client_about: String,
    client_country: String,
    client_region: String,
    client_connects: [],
    unmatched: [],
    disliked: []
});

const Client= mongoose.model("Client", clientUsers);

export default Client;