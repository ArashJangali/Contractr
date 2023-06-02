import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import Client from "./Clients.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./dbUsers.js";
import cookieParser from "cookie-parser";
import Message from "./messages.js";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";




dotenv.config({ path: './pass.env' });

const secretKey = process.env.SECRET_KEY;

// App Config

const app = express();
const port = process.env.PORT || 8001;
const connection_url = process.env.MONGODB_CONNECTION_URL

const frontendUrl = process.env.FRONTEND_URL;
const backendUrl = process.env.BACKEND_URL;

// MiddleWares
const corsOptions = {
    origin: frontendUrl,
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content type'],
    credentials: true,
};

app.use(express.json());
app.use(Cors(corsOptions));



// DB Config
 mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));


// API Endpoints
app.get("/", (req, res) => res.status(200).send("It's working!"));


// client signup

app.post("/clientsignup", async (req, res) => {
  const clientemail = req.body.email;
  const clientpass = req.body.password;
  const generatedClientId = uuidv4();
  const hashedClientPassword = await bcrypt.hash(clientpass, 10);

  try {
    const existingClient = await Client.findOne({ clientemail });

    if (existingClient) {
      return res
        .status(409)
        .send(
          "The provided email is already in use. Please log in or use a different email to register."
        );
    }
    const lowerCaseClientEmail = clientemail.toLowerCase();
    const clientData = {
      client_user_id: generatedClientId,
      email: lowerCaseClientEmail,
      password: hashedClientPassword,
    };
    const newClientUser = new Client(clientData);
    const createdClient = await newClientUser.save();

    const payload = {
      client_user_id: generatedClientId,
      email: lowerCaseClientEmail,
    };
    const token = jwt.sign(payload, secretKey, {
      expiresIn: 60 * 24,
    });
    res.status(201).json({ token, client_user_id: generatedClientId });
  } catch (err) {
    console.log(err);
  }
});


// contractor sign up
app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const genuserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .send(
          "The provided email is already in use. Please log in or use a different email to register."
        );
    }
    const lowerCaseEmail = email.toLowerCase();

    const data = {
      user_id: genuserId,
      email: lowerCaseEmail,
      password: hashedPassword,
    };
    const newUser = new User(data);
    const createdUser = await newUser.save();

    const payload = {
      user_id: genuserId,
      email: lowerCaseEmail,
    };

    const token = jwt.sign(payload, secretKey, {
      expiresIn: 60 * 24,
    });

    res.status(201).json({ token, userID: genuserId });
  } catch (err) {
    console.log(err);
  }
});

// client login
app.post("/clientlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });
    const correctPassword = await bcrypt.compare(password, client.password);

    if (client && correctPassword) {
      const token = jwt.sign({ client, email }, secretKey, {
        expiresIn: 60 * 24,
      });
      return res
        .status(201)
        .json({ token, client_user_id: client.client_user_id });
    }
    res.status(400).send("Invalid Credentials");
  } catch (error) {
    console.log(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});
  

// contractor login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const correctPassword = await bcrypt.compare(password, user.password);

    if (user && correctPassword) {
      const token = jwt.sign({ user, email }, secretKey, {
        expiresIn: 60 * 24,
      });
      return res.status(201).json({ token, userID: user.user_id });
    }
    res.status(400).send("Invalid Credentials");
  } catch (error) {
    console.log(error);
  }
}); 


// initialize passportjs and session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  const key = {
    id: user._id,
    type: user instanceof Client ? "client" : "user",
  };
  done(null, key);
});

passport.deserializeUser(async (key, done) => {
  let user;
  if (key.type === "client") {
    user = await Client.findById(key.id);
  } else {
    user = await User.findById(key.id);
  }

  done(null, user);
});

// Google OAuth for login (freelancer)
passport.use(
  "google-freelancer-login",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        `${backendUrl}/auth/google/freelancer/login/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });

        if (!user) {
          return done(null, false, {
            message: "No account found. Please sign up.",
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Google OAuth for signup (freelancer)
passport.use(
  "google-freelancer-signup",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
      `${backendUrl}/auth/google/freelancer/signup/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// client login GoogleStrategy

passport.use(
  "google-client-login",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${backendUrl}/auth/google/client/login/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const user = await Client.findOne({ googleId: profile.id });

        if (!user) {
          return done(null, false, {
            message: "No account found. Please sign up.",
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Google OAuth for signup (client)
passport.use(
  "google-client-signup",
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${backendUrl}/auth/google/client/signup/callback`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await Client.findOne({ googleId: profile.id });

        if (!user) {
          user = new Client({
            googleId: profile.id,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// freelancer successful google sign in auth

app.get(
  "/auth/google/freelancer/login",
  passport.authenticate("google-freelancer-login", {
    scope: ["profile", "email"],
  })
);

app.get("/failedFreelancerSignIn", (req, res) => {
  res.status(200).send(`
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f9f9f9;
          background: linear-gradient(135deg, #71b280 0%, #134c75 100%);
          color: #fff;
        }
        p {
          font-size: 1.2em;
        }
        button {
         
          margin-left: 10px;
          padding: 3px 5px;
          font-size: 1em;
          cursor: pointer;
          text-align: center;
          border-radius: 20px;
          color: #fff;
          background: linear-gradient(135deg, #71b280 0%, #134c75 100%);
          border: none;
          transition: background-color 0.3s ease;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        }
        button:hover {
          background: linear-gradient(135deg, #134c75 0%, #71b280 100%);
        }
      </style>
    </head>
    <body>
      <p>Login failed. Please Create an Account.</p>
      <button onclick="window.close()">❌</button>
    </body>
    </html>
  `);
});

app.get(
  "/auth/google/freelancer/login/callback",
  passport.authenticate("google-freelancer-login", {
    failureRedirect: "/failedFreelancerSignIn",
    failureMessage: true,
  }),
  function (req, res) {
    const message = req.user
      ? { status: "success", message: "Successful login", user: req.user }
      : {
          status: "failure",
          message: "Login failed. Please Create an Account",
        };

    const script = `
       <script>
       window.opener.postMessage(${JSON.stringify(message)}, "*");
       window.close();
       </script>
       `;

    res.send(script);
  }
);

// freelancer successful google sign up auth

app.get(
  "/auth/google/freelancer/signup",
  passport.authenticate("google-freelancer-signup", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/freelancer/signup/callback",
  passport.authenticate("google-freelancer-signup"),
  function (req, res) {
    const message = req.user
      ? {
          status: "success",
          message: "Account created successfully!",
          user: req.user,
        }
      : { status: "failure", message: "Signup failed. Please try again" };

    const script = `
       <script>
       window.opener.postMessage(${JSON.stringify(message)}, "*");
       window.close();
       </script>
       `;

    console.log("message", message);

    res.send(script);
  }
); 

app.get("/failedClientSignIn", (req, res) => {
  res.status(200).send(`
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f9f9f9;
          background: linear-gradient(135deg, #71b280 0%, #134c75 100%);
          color: #fff;
        }
        p {
          font-size: 1.2em;
        }
        button {
         
          margin-left: 10px;
          padding: 3px 5px;
          font-size: 1em;
          cursor: pointer;
          text-align: center;
          border-radius: 20px;
          color: #fff;
          background: linear-gradient(135deg, #71b280 0%, #134c75 100%);
          border: none;
          transition: background-color 0.3s ease;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        }
        button:hover {
          background: linear-gradient(135deg, #134c75 0%, #71b280 100%);
        }
      </style>
    </head>
    <body>
      <p>Login failed. Please Create an Account.</p>
      <button onclick="window.close()">❌</button>
    </body>
    </html>
  `);
});


// client successful google sign in auth


app.get(
  "/auth/google/client/login",
  passport.authenticate("google-client-login", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/client/login/callback",
  passport.authenticate("google-client-login", {
    failureRedirect: "/failedClientSignIn",
    failureMessage: true,
  }),
  function (req, res) {
    const message = req.user
      ? { status: "success", message: "Successful login", user: req.user }
      : {
          status: "failure",
          message: "Login failed. Please Create an Account",
        };

    const script = `
       <script>
       window.opener.postMessage(${JSON.stringify(message)}, "*");
       window.close();
       </script>
       `;

    console.log("message", message);

    res.send(script);
  }
);

// client successful google sign up auth

app.get(
  "/auth/google/client/signup",
  passport.authenticate("google-client-signup", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/client/signup/callback",
  passport.authenticate("google-client-signup"),
  function (req, res) {
    const message = req.user
      ? {
          status: "success",
          message: "Account created successfully!",
          user: req.user,
        }
      : { status: "failure", message: "Signup failed. Please try again" };

    const script = `
       <script>
       window.opener.postMessage(${JSON.stringify(message)}, "*");
       window.close();
       </script>
       `;

    console.log("message", message);

    res.send(script);
  }
); 


// successful oauth sesh

app.get("/auth/user", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).send("Unauthenticated");
  }
});


app.get("/user", async (req, res) => {
  try {
    const returnedUsers = await User.find();
    res.send(returnedUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});
  

app.get("/profile", async (req, res) => {
  const userId = req.query.userId;
  try {
    const query = { client_user_id: userId };
    const user = await Client.findOne(query);
    return res.send(user);
  } catch (err) {
    console.log("profile endpoint error", err);
  }
});


app.get("/freelancerprofile", async (req, res) => {
  const userId = req.query.userId;
  try {
    const query = { user_id: userId };
    const user = await User.findOne(query);
    return res.send(user);
    console.log(user);
  } catch (err) {
    console.log("profile endpoint error", err);
  }
});



app.get("/clientuser", async (req, res) => {
  try {
    const returnedClientUsers = await Client.find();
    res.send(returnedClientUsers);
  } catch (error) {
    res.status(500).send(error);
  }
});



// when a freelancer creates profile

app.put("/user", async (req, res) => {
  const formData = req.body.formData;

  try {
    const foundUser = await User.findOne({ user_id: formData.user_id });

    if (foundUser) {
      const updateDoc = {
        $set: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          job_title: formData.job_title,
          rate: formData.rate,
          novice: formData.novice,
          skilled: formData.skilled,
          expert: formData.expert,
          url: formData.url,
          about: formData.about,
          country: formData.country,
          region: formData.region,
        },
      };
      const updatedUser = await User.findOneAndUpdate(
        { user_id: formData.user_id },
        updateDoc,
        { new: true }
      );
      res.send(updatedUser);
      return;
    } else {
      res.status(404).send("User not found");
      return;
    }
  } catch (err) {
    console.log(err);
  }
});

// when a client creates profile

app.put("/clientuser", async (req, res) => {
  const clientForm = req.body.clientForm;

  try {
    const foundClient = await Client.findOne({
      client_user_id: clientForm.client_user_id,
    });

    if (foundClient) {
      const updateClientDoc = {
        $set: {
          client_first_name: clientForm.client_first_name,
          client_last_name: clientForm.client_last_name,
          client_talent: clientForm.client_talent,
          client_rate: clientForm.client_rate,
          client_experience: clientForm.client_experience,
          client_url: clientForm.client_url,
          client_about: clientForm.client_about,
          client_country: clientForm.client_country,
          client_region: clientForm.client_region,
        },
      };
      const updatedClient = await Client.findOneAndUpdate(
        { client_user_id: clientForm.client_user_id },
        updateClientDoc,
        { new: true }
      );
      res.send(updatedClient);
      return;
    } else {
      res.status(404).send("User not found");
      return;
    }
  } catch (err) {
    console.log(err);
  }
});

// retrieving the liked freelancer objects

app.get("/freelancerconnects", async (req, res) => {
  const userIds = JSON.parse(req.query.userIds);

  try {
    if (userIds.length === 0) {
      res.status(400).send({ error: "userIds array is empty." });
      return;
    }
    const likedFreelancers = await User.find({ user_id: { $in: userIds } });
    res.status(200).send(likedFreelancers);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ err: "An error occured while fetching the liked freelancers." });
  }
});

// retrieving the liked client objects

app.get("/likedClients", async (req, res) => {
  const clientIds = JSON.parse(req.query.likedClientIds);

  try {
    if (clientIds.length === 0) {
      res.status(400).send({ error: "clientIds array is empty" });
    }
    const likedClients = await Client.find({
      client_user_id: { $in: clientIds },
    });
    res.status(200).send(likedClients);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ err: "An error occured while fetching the liked clients." });
  }
});


// adding  liked clients

app.put("/addLikedClients", async (req, res) => {
  const { userId, likedClientId } = req.body;

  try {
    const query = { user_id: userId };
    const updateDoc = {
      $addToSet: { connects: { user_id: likedClientId } },
    };
    const user = await User.updateOne(query, updateDoc);
    return res.send(user);
    console.log(user);
  } catch (error) {
    console.log(error);
  }
});



// removing a client from the liked array
app.patch("/removeLikedClients", async (req, res) => {
  const { userId, clientId } = req.body;
  try {
    const query = { user_id: userId };
    const updateDoc = {
      $pull: { connects: { user_id: clientId } },
    };
    const user = await User.findOneAndUpdate(query, updateDoc, { new: true });
    return res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// removing a freelancer from the liked array

app.patch("/removeLikedFreelancers", async (req, res) => {
  const { userId, freelancerId } = req.body;
  try {
    const query = { client_user_id: userId };
    const updateDoc = {
      $pull: { client_connects: { client_user_id: freelancerId } },
    };
    const user = await Client.findOneAndUpdate(query, updateDoc, { new: true });
    return res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// removing a freelancer from the disliked array
app.patch("/deleteDisliked", async (req, res) => {
  const { userId, dislikedFreelancerId } = req.body;
  try {
    const query = { client_user_id: userId };
    const updateDoc = {
      $pull: { disliked: { client_user_id: dislikedFreelancerId } },
    };
    const user = await Client.findOneAndUpdate(query, updateDoc, { new: true });
    return res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// removing a client from the disliked array
app.patch("/deleteDislikedClient", async (req, res) => {
  const { userId, dislikedClientId } = req.body;
  try {
    const query = { user_id: userId };
    const updateDoc = {
      $pull: { disliked: { user_id: dislikedClientId } },
    };
    const user = await User.findOneAndUpdate(query, updateDoc, { new: true });
    return res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// unmatching clients

app.patch("/unmatchClient", async (req, res) => {
  const { loggedInId, id } = req.body;

  try {
    const query = { user_id: loggedInId };
    const updateDoc = {
      $pull: { connects: { user_id: id } },
      $push: { unmatched: { user_id: id } },
    };
    const user = await User.findOneAndUpdate(query, updateDoc, { new: true });
    return res.send(user);
  } catch (error) {
    console.log("error unmatching with clients", error);
  }
});

// unmatching freelancers

app.patch("/unmatchFreelancer", async (req, res) => {
  const { loggedInId, id } = req.body;

  try {
    const query = { client_user_id: loggedInId };
    const updateDoc = {
      $pull: { client_connects: { client_user_id: id } },
      $push: { unmatched: { client_user_id: id } },
    };
    const user = await Client.findOneAndUpdate(query, updateDoc, { new: true });
    return res.send(user);
  } catch (error) {
    console.log("error unmatching with freelancer", error);
  }
});

//   getting all the unmatched freelancers

app.get("/getUnmatchedFreelancers", async (req, res) => {
  const { userId } = req.query;

  try {
    const client = await Client.findOne({ client_user_id: userId });
    const unmatchedFreelancers = client.unmatched;
    res.send(unmatchedFreelancers);
  } catch (error) {
    console.log(error);
  }
});

// getting all the unmatched clients

app.get("/getUnmatchedClients", async (req, res) => {
  const { userId } = req.query;

  try {
    const freelancer = await User.findOne({ user_id: userId });
    const unmatchedClients = freelancer.unmatched;
    res.send(unmatchedClients);
  } catch (error) {
    console.log(error);
  }
});

// putting the liked freelancers' userid in the client_connects array, which is the liked array.

app.put("/addConnect", async (req, res) => {
  const { userId, likedFreelancerIds } = req.body;

  try {
    const query = { client_user_id: userId };
    const updateDoc = {
      $addToSet: { client_connects: { client_user_id: likedFreelancerIds } },
    };

    const user = await Client.updateOne(query, updateDoc);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// disliking freelancers

app.put("/addDislikedFreelancer", async (req, res) => {
  const { userId, dislikedFreelancerId } = req.body;

  try {
    const query = { client_user_id: userId };
    const updateDoc = {
      $addToSet: { disliked: { client_user_id: dislikedFreelancerId } },
    };
    const user = await Client.updateOne(query, updateDoc);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// disliking clients

app.put("/addDislikedClient", async (req, res) => {
  const { userId, dislikedClientId } = req.body;

  try {
    const query = { user_id: userId };
    const updateDoc = {
      $addToSet: { disliked: { user_id: dislikedClientId } },
    };
    const user = await User.updateOne(query, updateDoc);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// sending message from clients to freelancers

app.post("/messages", async (req, res) => {
  const {
    senderId,
    senderName,
    senderImg,
    content,
    receiverId,
    receiverName,
    receiverImg,
  } = req.body;
  const timestamp = Date.now();

  try {
    const query = {
      senderId,
      sender_first_name: senderName,
      sender_url: senderImg,
      receiverId,
      receiver_first_name: receiverName,
      receiver_url: receiverImg,
      content,
      timestamp,
    };

    const message = new Message(query);
    const response = await message.save();
    res.send(response);
  } catch (err) {
    console.log("error sending message", err);
  }
});

// fetching messages

app.get("/messages", async (req, res) => {
  const { senderId, receiverId } = req.query;

  try {
    const signedInClientmessages = await Message.find({
      senderId: senderId,
      receiverId: receiverId,
    }).exec();
    const freelancerMessages = await Message.find({
      senderId: receiverId,
      receiverId: senderId,
    }).exec();
    const messages = signedInClientmessages
      .concat(freelancerMessages)
      .sort((a, b) => a.timestamp - b.timestamp);
    res.send(messages);
  } catch (err) {
    console.log("error fetching messages", err);
  }
});

// Listener
app.listen(port, () => console.log(`listening on: ${port}`));
