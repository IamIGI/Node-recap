const allowedOrigins: string[] = [
  'http://localhost:3000', //Old React client
];

const corsConfig = {
  // @ts-ignore - to ignore typescrip warrnings
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      //remove '!origin' after development
      callback(null, true); //send true when origin url in the whitelist
    } else {
      callback(new Error('not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

export default corsConfig;
