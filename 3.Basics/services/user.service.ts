import UserModel, { AddUser, User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

async function getUsers() {
  const usersModels = await UserModel.findAll();
  return usersModels.map((userItem) => userItem.dataValues);
}

async function addUser(user: AddUser) {
  const { name, email } = user;
  console.log(user);
  try {
    return await UserModel.create({
      id: uuidv4(),
      name,
      email,
    });
  } catch (e) {
    console.error(e);
  }
}

export default { getUsers, addUser };
