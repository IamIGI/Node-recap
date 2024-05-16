import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db.util';

export interface User {
  id: string;
  name: string;
  email: string;
}

interface UserCreationAttributes extends User {}

class UserModel extends Model<User, UserCreationAttributes> implements User {
  public id!: string;
  public name!: string;
  public email!: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.DECIMAL, allowNull: false },
  },
  {
    sequelize, // Pass your Sequelize instance
    modelName: 'Product', // Name of the model
  }
);

export default UserModel;
