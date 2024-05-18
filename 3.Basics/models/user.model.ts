import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Association,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  UUIDV4,
  UUID,
} from 'sequelize';
import { sequelize } from '../util/db.util';
import ProductModel from './product.model';

//TODO: replace it, so it will be based on User interface, just delete the id field
export interface AddUser {
  name: string;
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;

  declare createProduct: HasManyCreateAssociationMixin<ProductModel, 'userId'>;
  declare getProducts: HasManyGetAssociationsMixin<ProductModel>;

  //TODO: remove it?
  declare products?: ProductModel[]; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    products: Association<UserModel, ProductModel>;
  };
}

UserModel.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize, // Pass your Sequelize instance
    tableName: 'users',
    modelName: 'User', // Name of the model
    // paranoid: true // for soft delete
  }
);

export default UserModel;
