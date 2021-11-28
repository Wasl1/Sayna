const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
          },
          lastname: {
            type: String,
            required: true
          },
          email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique: true,
            trim: true,
          },
          password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6
          },
          date_naissance: {
              type: Date
          },
          sexe: {
              type: String
          }
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function(next){
  let user = this;

  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
      if(err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {

          if(err) return next(err);
          user.password = hash;
          next();
      });
  });
}); 

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw 'Votre email ou password est erroné';
  }
  throw 'Votre email ou password est erroné'
}

userSchema.methods.toJSON = function(){
    let obj = this.toObject();
    delete obj._id;
    delete obj.password;
    delete obj.__v;
    delete obj.updatedAt;
    return obj;
}  

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;