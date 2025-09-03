### How to Build a REST API with Node.js and TypeScript

### Initialize the Project 
1)  mkdir her-healing-initiative-api 
2) cd her-healing-initiative-api
3)  npm init -y  //It would create a pacakge.json 

### Install TypeScript and Node Dependencies
npm install typescript ts-node @types/node --save-dev

### Install Express and Its Types
npm install express
npm install @types/express --save-dev

### Install a Nodemon for Development
npm install nodemon ts-node --save-dev

### Set Up TypeScript Configuration -- will generate a tsconfig.json
npx tsc --init 

### Add Scripts to package.json
"scripts": {
  "start": "ts-node src/index.ts",
  "dev": "nodemon src/index.ts",
  "build": "tsc",
  "serve": "node dist/index.js"
}

### Create the Express Server

### Run the Server
npm run dev

### Define Routes for CRUD Operations
Create a src/routes/bookRoutes.ts file

### Define Routes in your Startup Project 
Update src/index.ts

### Routes 
GET: Retrieve all books by sending a GET request to http://localhost:5500/api/books
GET (by ID): Retrieve a specific book by sending a GET request to http://localhost:5500/api/books/:id
POST: Create a new book by sending a POST request with JSON data (title and author) to http://localhost:5500/api/books
PUT: Update a book by sending a PUT request to http://localhost:5500/api/books/:id
DELETE: Delete a book by sending a DELETE request to http://localhost:5500/api/books/:id

GET: Retrieve all books by sending a GET request to http://localhost:5500/api/countries

GET: Retrieve all books by sending a GET request to http://localhost:5500/api/users

### Build and Serve Your API
npm run build
npm run serve

### Other References 
https://robkendal.co.uk/blog/build-a-restful-node-api-server-using-json-and-typescript/

### Tests / Via Posatman 
http://localhost:3000/api/books

body :  { "title": "Scholastics Gold", "author": "Aditi Rajaraman" }
response : {
    "id": 5,
    "title": "Scholastics Gold",
    "author": "Aditi Rajaraman"
}

### Integrate CORS  
npm install @types/cors
https://www.twilio.com/en-us/blog/add-cors-support-express-typescript-api

### End Urls 
http://localhost:5000/api/workItems


### References

### How to Use TypeScript with MongoDB Atlas
####  https://www.mongodb.com/developer/languages/javascript/node-connect-mongodb/
#### https://www.mongodb.com/resources/products/compatibilities/using-typescript-with-mongodb-tutorial
#### https://www.mongodb.com/community/forums/t/typescript-create-db-collection-and-add-json-data-to-the-collection/215478
#### https://www.mongodb.com/community/forums/t/working-with-node-js-driver-using-typescript-and-express/259524

### integrate Mongodb
#### npm install mongoose
#### npm install mongoose @types/mongoose

# Github Repo Settings 
### git config --get user.name 
### git config --get user.email 
### git config set  user.name "aditirajaraman"
### git config set  user.email "aditirajaraman10272008@gmail.com"

### POST
http://localhost:5500/api/users
{
	"firstname" : "Aditi", 
	"lastname":"Rajaraman",
	"email":"aditirajaraman10272008@gmail.com",
	"country":"USA",
	"username":"aditir",
	"password":"aditi@r",
	"birthdate":"27/10/2008"
}

//POST
http://localhost:5500/api/events
{
	"eventTitle" : "Writing and Mindfulness", 
	"eventSubTitle":"Host @HerHealing Initiative",
	"eventSummary":"This workshop will be a combination of writing exercises, meditation, mindfulness practices, somatics, discussion, lecture, etc. all centered around the theme of cultivating self-compassion. This a weekly workshop and each week we'll focus on a different topic."
}

### How To run the Project 
Launch VSCode Terminal 
npm run dev

### Debug API 
1) Launch Postman 
2) Choose Method : GET, POST etc. 
3) New HTTP Request on Postman 
4) Run API : http://localhost:5500/api/events

### Setting up Multiple Environments 
https://thegeekplanets.medium.com/managing-environment-variables-in-node-js-using-the-dotenv-package-2a5c8eee61a8

https://traveling-coderman.net/code/node-architecture/configuration-management/

https://stackoverflow.com/questions/46266609/host-node-js-on-windows-server-iis


### Setting up Environment Variables 
https://medium.com/@zouyu1121/how-to-check-and-set-the-node-env-environment-variable-and-its-use-in-a-project-1fd70eb0b5a1

# API End point : http://localhost:5000/api/blogs
# API End point : http://localhost:5000/api/blogs/6884037963259be72a3fd42b

### install unique id depednencies 
npm install uuid
npm install react-router-dom

### install mutler
> npm install multer @types/multer
> npm install multer-s3 @types/multer-s3

#### install aws-sdk
> npm install aws-sdk
> npm install @aws-sdk/client-s3

#### Integrate Sesssionless cookies 
> npm install express express-session  --force
> npm install --save-dev @types/express @types/express-session --force
> npm install connect-mongo

#### JWT Integration
Generate JWT Secrets

#### rimraf
npm install --save-dev rimraf copyfiles

https://jwtsecretkeygenerator.com/
https://bcrypt-generator.com/

### npm install bcryptjs @types/bcryptjs
### npm install jsonwebtoken  @types/jsonwebtoken
### npm install zod

#### -----------------------DEPLOYMENT------------------------------###

### Pre-Requisites 
> Follow https://docs.google.com/document/d/1NquQ1lL93cbc53aHCgU_nm5oXDDGJnyzL2h7Xvy-p90/edit?usp=drive_link  
> setx NODE_ENV "production"

1) Take backup of D:\Data\Apps\her-healing-initiative-api
2) npm run build on local machine of her-healing-initiative-api
3) copy <local folder>\her-healing-initiative-api\dist folder and overwrite 
4) copy <local folder>\her-healing-initiative-api\package.json 
5) include <local folder>\her-healing-initiative-api\src\data folder to destination
6) delete existing node_modules, package-lock.json and run npm install -force
7) setup web.config
8) Test API http://her-healing-initiative-api.org/api/blogs