import mongoose from 'mongoose';

interface IEmployeeAttrs {
  name: string;
  email: string;
  phone: string;
  position?: string;
  picture?: string;
  salary?: string;
}

interface IEmployeeDoc extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  position?: string;
  picture?: string;
  salary?: string;
}

interface IEmployeeModel extends mongoose.Model<IEmployeeDoc> {
  build(attrs: IEmployeeAttrs): IEmployeeDoc;
}

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    position: String,
    picture: String,
    salary: String,
  },
  {
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Employee = mongoose.model<IEmployeeDoc, IEmployeeModel>(
  'Employee',
  employeeSchema
);

employeeSchema.statics.build = (employee: IEmployeeAttrs) => {
  return new Employee(employee);
};

export { Employee };
