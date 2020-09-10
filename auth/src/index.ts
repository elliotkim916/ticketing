import express from 'express';
import 'express-async-errors'; // if we throw an error in an async function, this package makes sure express listens for it
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.set('trust proxy', true);
// adding this to make sure that express is aware that its behind a proxy of ingress engine x
// and to make sure that it should trust traffic even though its coming from that proxy

app.use(json());
app.use(
  cookieSession({
    signed: false, // disabled encryption
    secure: true, // https connection
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startDb = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }

  try {
    // the url is mongodb:// along with the name of our cluster ip service for our mongo instance
    // along with the port
    // and auth, which is the name of the db that we want to connect to
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connecting to MongoDB!');
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => {
    console.log('Listening on PORT 3000');
  });
};

startDb();
