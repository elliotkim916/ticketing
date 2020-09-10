import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // we are customizing what we return
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password; // removes property from obj
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// anytime we attempt to save a document to our db, we execute this async function
userSchema.pre('save', async function (done) {
  // we use function keyword because whenever we put together a middleware function we get access to the document that is being saved
  // so the actual user were trying to persist to the database is 'this'
  // if we used an arrow function, 'this' would be equal to the context of this entire file

  if (this.isModified('password')) {
    // we do this because we might be retrieving the user out of the db and then trying to save them back into the db at some future point
    // Even when creating password for the first time, mongoose will consider password to be modified, isModified will return true
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

// Everything in the < > can be thought of as types being provided to a function as arguments
// the second type argument means this will return something of value type UserModel
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
