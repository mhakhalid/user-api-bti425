const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let mongoDBConnectionString = process.env.MONGO_URL;

let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    unique: true
  },
  password: String,
  favourites: [String],
  history: [String]
});

let User;

// Prevent redefining the model during re-runs (important for Vercel)
function getUserModel() {
  return mongoose.models.users || mongoose.model("users", userSchema);
}

// Connect only once
module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    if (mongoose.connection.readyState === 1) {
      // Already connected
      User = getUserModel();
      resolve();
    } else {
      mongoose.connect(mongoDBConnectionString)
        .then(() => {
          User = getUserModel();
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};

// Registration
module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt.hash(userData.password, 10).then(hash => {
        userData.password = hash;
        let newUser = new User(userData);

        newUser.save().then(() => {
          resolve("User " + userData.userName + " successfully registered");
        }).catch(err => {
          if (err.code == 11000) {
            reject("User Name already taken");
          } else {
            reject("There was an error creating the user: " + err);
          }
        });
      }).catch(err => reject(err));
    }
  });
};

// Login
module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.findOne({ userName: userData.userName })
      .exec()
      .then(user => {
        if (!user) return reject("User not found");
        bcrypt.compare(userData.password, user.password).then(res => {
          if (res === true) {
            resolve(user);
          } else {
            reject("Incorrect password for user " + userData.userName);
          }
        });
      }).catch(() => {
        reject("Unable to find user " + userData.userName);
      });
  });
};

// All other methods remain unchanged
module.exports.getFavourites = function (id) {
  return User.findById(id).exec().then(user => {
    if (!user) throw `User with id ${id} not found`;
    return user.favourites;
  });
};

module.exports.addFavourite = function (id, favId) {
  return User.findByIdAndUpdate(id,
    { $addToSet: { favourites: favId } },
    { new: true }
  ).exec().then(user => {
    if (!user) throw "User not found";
    return user.favourites;
  });
};

module.exports.removeFavourite = function (id, favId) {
  return User.findByIdAndUpdate(id,
    { $pull: { favourites: favId } },
    { new: true }
  ).exec().then(user => {
    if (!user) throw "User not found";
    return user.favourites;
  });
};

module.exports.getHistory = function (id) {
  return User.findById(id).exec().then(user => {
    if (!user) throw `User with id ${id} not found`;
    return user.history;
  });
};

module.exports.addHistory = function (id, historyId) {
  return User.findByIdAndUpdate(id,
    { $addToSet: { history: historyId } },
    { new: true }
  ).exec().then(user => {
    if (!user) throw "User not found";
    return user.history;
  });
};

module.exports.removeHistory = function (id, historyId) {
  return User.findByIdAndUpdate(id,
    { $pull: { history: historyId } },
    { new: true }
  ).exec().then(user => {
    if (!user) throw "User not found";
    return user.history;
  });
};

module.exports.getUserById = function (id) {
  return User.findById(id).exec().then(user => {
    if (!user) throw "User not found";
    return user;
  });
};
