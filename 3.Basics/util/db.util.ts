import mysql from 'mysql2';

//pool - allow for multiple connections
const connect = mysql
  .createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node-complete',
  })
  .promise();

export default {
  connect,
};
