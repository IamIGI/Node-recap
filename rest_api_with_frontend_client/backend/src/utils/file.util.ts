import fs from 'fs';
import path from 'path';

const deleteFile = (filePath: string) => {
  console.log('deleteFile attempt');
  const pathAbsolute = path.join(process.cwd(), filePath);
  console.log(pathAbsolute);

  fs.unlink(pathAbsolute, (err) => {
    if (err) throw err;
  });
};

export default {
  deleteFile,
};
