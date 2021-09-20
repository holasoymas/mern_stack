const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// todo ==>> HASHING PASSWORD When Regestering
mySchema.pre("save", async function (next) {
  console.log("modified");
  if (this.isModified("password")) {
    //! this will convert into hash only when the password ins modified
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

// todo ===>>> genertating JWT token in DataBase
mySchema.methods.generateAuthToken = async function () {
  try {
    //? GENERATING TOKEN
    let userToken = jwt.sign({ _id: this.id }, process.env.SECRET_KEY);
    //? STORING TOKENS TO DATABASE
    this.tokens = this.tokens.concat({ token: userToken });
    //? SAVING TOKEN TO DATABASE
    await this.save();
    //? RETURN TOKEN
    return userToken;
  } catch (error) {
    console.log(error);
  }
};

// todo ===>> STORING THE USER MESSAGE
mySchema.methods.addMessage = async function (name, email, phone, message) {
  try {
    this.messages = this.messages.concat({
      name,
      email,
      phone,
      message: message,
    });
    await this.save();
    return this.messages;
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", mySchema);

module.exports = User;
