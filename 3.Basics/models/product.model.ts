import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db.util';
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

interface ProductCreationAttributes extends Product {}

class ProductModel
  extends Model<Product, ProductCreationAttributes>
  implements Product
{
  public id!: string;
  public title!: string;
  public price!: number;
  public imageUrl!: string;
  public description!: string;

  // Add any additional methods or static properties here if needed
}

ProductModel.init(
  {
    id: {
      type: DataTypes.STRING,
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
    modelName: 'Product', // Name of the model
  }
);

export default ProductModel;
