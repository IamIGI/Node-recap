import fs from 'fs';
import path from 'path';

const deleteFile = (filePath: string) => {
  const pathAbsolute = path.join(process.cwd(), filePath);

  fs.unlink(pathAbsolute, (err) => {
    if (err) throw err;
  });
};

export default {
  deleteFile,
};
