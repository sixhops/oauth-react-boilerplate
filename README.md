# Typescript Notes

## Express with Typescript

1. We use ES6 style import syntax instead of requires for node modules

2. Import your external route files and then app.use them:

```js
import authRouter from './routes/auth';
app.use('/auth', authRouter);
```

3. Routes don't seem to need any special Typescripty stuff apart from the ES6 imports.

4. You need to npm install an `@types/name-of-module` definition file for literally every node module you want to use. Haven't seen a way to automate this yet.

### Mongoose

1. mongoose.Schema doesn't seem to be defined (seems to be a trend). We had to import both individually:

```js
import mongoose from 'mongoose';
import {Schema} from 'mongoose';
```

2. The mongoose connection string must be cast as a string:

```js
mongoose.connect(process.env.MONGODB_URI as string);
```

3. mongoose.connection (which we usually abbreviate to db) doesn't seem to define the `host` and `port` properties.

#### Models

Our models usually inherit from an ORM model class but we add fields and methods and when that happens, the original model type is no longer sufficient. We must define an interface that includes our data fields and any methods we have attached. But if we need to say that our interface contains functions, we need function interfaces for those functions. A function interface consists of each parameter and its type as well as the return value and its type. We can use a normal interface for it:

We made an `authenticated` function on our `user` model so we need to make an interface for it:

```js
interface IAuthenticated {
  (password: string): boolean
}
```

But the `toObject` transform function is part of the mongoose Model so we don't need to do this:

```js
// This one isn't necessary if we extend mongoose.Model
interface IModelToObject {
  (): IUser
}
```

Instead, because it is an actual mongoose document, the interface we make for the Model must extend mongoose.Document:

```js
export interface IUser extends mongoose.Document {
  _id?: string;
  name: string;
  email: string;
  password: string;
  authenticated: IAuthenticated;
}
```

This takes care of the base shape of the model.

We can export this one so it can be used in routes and state.

### Passport

Nothing special was needed beyond the ES6 imports.

## React with Typescript

`create-react-app` now has a typescript option --typescript which will generate a Typescript starter for a React project. It also integrates tsc into the normal build/run process so no need to futz with the output.

1. Types for every standard react module are automatically installed. (react-router-dom and its types are not.)
2. A tsconfig.json is autogenerated.
3. Functional components have the type `React.FC` and it automatically adds it to generated files.
4. The `useState` hook is a generic and needs to be passed a type. This type should line up with the type of this piece of state:

```js
const [user, setUser] = useState<IUser>({} as IUser)
const [count, setCount] = useState<number>(0)
const [names, setNames] = useState<string[]>([] as string[])
```

5. React's synthetic events must be typed before using them in handlers. For example, a click event would be of type `React.MouseEvent`

6. Promises are generics that need to be concretely typed.
