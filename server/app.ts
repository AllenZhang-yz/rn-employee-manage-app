import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import ngrok from 'ngrok';
import { Employee } from './models/employee';
import { HttpError } from './models/httpError';

const app = express();

app.use(bodyParser.json());

const mongoUrl =
  'mongodb+srv://employeeapp:4mHg42qKdyAPekWP@cluster0.ycmnj.mongodb.net/employeeapp?retryWrites=true&w=majority';

app.get('/', async (req, res) => {
  try {
    const employees = await Employee.find({});
    res
      .status(200)
      .send(employees.map((employee) => employee.toObject({ getters: true })));
  } catch (err) {
    console.log(err);
    const error = new HttpError('Getting employees failed', 500);
    return res
      .status(500)
      .send({ message: error.message, statusCode: error.statusCode });
  }
});

app.post('/send-data', async (req, res, next) => {
  const { name, email, phone, salary, position, picture } = req.body;
  const createdEmployee = new Employee({
    name,
    email,
    phone,
    picture,
    salary,
    position,
  });
  try {
    await createdEmployee.save();
    res
      .status(201)
      .json({ employee: createdEmployee.toObject({ getters: true }) });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Creating new employee failed', 500);
    return res
      .status(500)
      .send({ message: error.message, statusCode: error.statusCode });
  }
});

app.delete('/delete/:eid', async (req, res, next) => {
  const id = req.params.eid;
  try {
    await Employee.findByIdAndRemove(id);
    res.status(200).send('Delete successfully');
  } catch (err) {
    console.log(err);
    const error = new HttpError('Deleting employee failed', 500);
    return res
      .status(500)
      .send({ message: error.message, statusCode: error.statusCode });
  }
});

app.patch('/update', async (req, res, next) => {
  const { id, name, email, phone, salary, position, picture } = req.body;
  try {
    await Employee.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      salary,
      position,
      picture,
    });
    res.status(200).send('Update successfully');
  } catch (err) {
    console.log(err);
    const error = new HttpError('Updating employee failed', 500);
    return res
      .status(500)
      .send({ message: error.message, statusCode: error.statusCode });
  }
});

const appConnection = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    app.listen(3000, () => {
      console.log('Listening on port 30000...');
    });
    const url = await ngrok.connect(3000);
    console.log(url);
  } catch (err) {
    console.log(err);
  }
};
mongoose.connection.on('connected', () =>
  console.log('Connected to MongoDb successfully...')
);
mongoose.connection.on('error', (err) => console.log(err));

appConnection();
