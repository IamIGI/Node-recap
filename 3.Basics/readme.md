# Express Application Setup

## Packages Used

- **csrf**: [csurf](https://www.npmjs.com/package/csurf)
- **multer**: [multer](https://www.npmjs.com/package/multer)

## Serving Static Files

To serve files statically in your Express application, follow these steps:

1. **Save the File Path to the Database**:

   - Save the file path in the database without an absolute path. For example:
     ```
     '/images/0ced168b-7a8e-47cf-80c7-51b3dc7d3e42_igor.jpg'
     ```

2. **Request the Image**:

   - Ensure the image is requested with a URL like this:
     ```
     http://localhost:3000/images/0ced168b-7a8e-47cf-80c7-51b3dc7d3e42_igor.jpg
     ```

3. **Serve Files Statically**:
   - Declare the static folder in your Express application as follows:
     ```javascript
     app.use('/images', express.static(path.join(process.cwd(), 'images')));
     ```
     - The first argument (`'/images'`) indicates that the given path from the second argument will be checked only if the request starts with `/images/...`. For example:
       ```
       /images/0ced168b-7a8e-47cf-80c7-51b3dc7d3e42_igor.jpg
       ```
