import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUID,
  UUIDV4,
} from 'sequelize';
import { sequelize } from '../util/db.util';
import UserModel from './user.model';
export interface PostAddProductRequest {
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  price: number;
}

class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare price: number;
  declare imageUrl: string;
  declare description: string;

  declare userId: ForeignKey<UserModel['id']>;

  // Add any additional methods or static properties here if needed
}

ProductModel.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize, // Pass your Sequelize instance
    tableName: 'Products',
    modelName: 'Product', // Name of the model
  }
);

export default ProductModel;
