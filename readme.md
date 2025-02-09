# How to Build a REST API with Node.js and TypeScript

How to Build a REST API with Node.js and TypeScript

# Initialize the Project 
mkdir her-healing-initiative-api
cd her-healing-initiative-api
npm init -y  //It would create a pacakge.json 

# Install TypeScript and Node Dependencies
npm install typescript ts-node @types/node --save-dev

# Install Express and Its Types
npm install express
npm install @types/express --save-dev


# Install a Nodemon for Development
npm install nodemon ts-node --save-dev

# Set Up TypeScript Configuration -- will generate a tsconfig.json
npx tsc --init 

# Add Scripts to package.json
"scripts": {
  "start": "ts-node src/index.ts",
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "serve": "node dist/index.js"
}

# Create the Express Server
src/index.ts file

# Run the Server
npm run dev


# Define Routes for CRUD Operations
Create a src/routes/bookRoutes.ts file

# Define Routes in your Startup Project 
Update src/index.ts

# Routes 
GET: Retrieve all books by sending a GET request to http://localhost:5500/api/books
GET (by ID): Retrieve a specific book by sending a GET request to http://localhost:5500/api/books/:id
POST: Create a new book by sending a POST request with JSON data (title and author) to http://localhost:5500/api/books
PUT: Update a book by sending a PUT request to http://localhost:5500/api/books/:id
DELETE: Delete a book by sending a DELETE request to http://localhost:5500/api/books/:id

GET: Retrieve all books by sending a GET request to http://localhost:5500/api/countries

GET: Retrieve all books by sending a GET request to http://localhost:5500/api/users

# Build and Serve Your API
npm run build
npm run serve


# Other References 
https://robkendal.co.uk/blog/build-a-restful-node-api-server-using-json-and-typescript/

# Tests / Via Posatman 
http://localhost:3000/api/books

body :  { "title": "Scholastics Gold", "author": "Aditi Rajaraman" }
response : {
    "id": 5,
    "title": "Scholastics Gold",
    "author": "Aditi Rajaraman"
}

## Integrate CORS  
https://www.twilio.com/en-us/blog/add-cors-support-express-typescript-api

## End Urls 
http://localhost:5000/api/workItems


## References

# How to Use TypeScript with MongoDB Atlas
https://www.mongodb.com/developer/languages/javascript/node-connect-mongodb/
https://www.mongodb.com/resources/products/compatibilities/using-typescript-with-mongodb-tutorial
https://www.mongodb.com/community/forums/t/typescript-create-db-collection-and-add-json-data-to-the-collection/215478
https://www.mongodb.com/community/forums/t/working-with-node-js-driver-using-typescript-and-express/259524

### Github Repo Settings 
git config --get user.name 
git config --get user.email 
git config set  user.name "aditirajaraman"
git config set  user.email "aditirajaraman10272008@gmail.com"