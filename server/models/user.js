const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// modify the toJSON method of the schema to format the objects returned by Mongoose
// in this case, we need to convert the object id _id to string
// we also don't want to return the mongo versioning field __v to the client.
// finally, we don't want to reveal the password hash of the user to the client
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    const year = returnedObject.birthdate.getFullYear();
    // pad the month with 0 if length is less than 2, e.g. 02 instead of 2, but keep 11 as it is
    const month = String(returnedObject.birthdate.getMonth() + 1).padStart(
      2,
      "0"
    );
    const date = returnedObject.birthdate.getDate();
    returnedObject.birthdate = `${year}/${month}/${date}`;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
