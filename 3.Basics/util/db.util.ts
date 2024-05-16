import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('node-complete', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost',
});
