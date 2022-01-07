<h1 align="center">Digital Republic - Challenge</h1>

## About:
DR_Challenge simulates an API bank with features as: account creation, transfers between accounts and deposits.<br/>

## How to start:
- Clone this repository;
- Open the terminal on the root folder and use 'npm install';
- Copy the enviroment variables from '.envExample' and create a new file called '.env' then paste and fill them;
- Then go to the next step to test all endpoints.

## API documentation:
To try out all endpoints and their respective responses, I used Swagger to document  the  routes. <br/>
- First you need to start the application by calling 'npm start' on  root path on terminal;
- Second, open the browser and access "localhost:3000/doc".

## Dependencies used:  
- cors: allows servers to specify not only who can access the assets, but also how they can be accessed; <br/>
- cpf-cnpj-validator: is a lib that validates CPF format and if it's a real one; <br/> 
- dotenv: used to keep sensible data private, as: SQL login, PORT, database name, and others; with .env files; <br/>
- express: great for designing and building web applications quickly and easily since it only needs JS. Sincerely? Express is the only framework I've studied so far and I Know there are many more that could have solved the problem, as AdonisJS, which supports Typescript; but I know Express is an amazing tool as well, so... <3 <br/>
- express-rescue: allows a cleaner and more readable code by wrapping up all erros and sending them to 'next()' on your handler error, as a middleware; <br/>
- fast-text-encoding: this tool I confess I've never encountered before. An error showed up not allowing my integration tests to work. So I googled up and found this solution, which only had to be required on test's first line and worked =) <br/>
- joi: joi is an amazing and powerful tool where you can validate your entries through schemas for Javascript code; <br/>
- mongodb: as MongoDB is a non-relational database, relationships between data would have a better fit with relational databases, as MySQL. This is somewhat related to hierarchical data, but instead of ownership, you need peer relationships. Since the API doesn't need those relationships, found it more proper to use MongoDB, as we still can count on: storing large amount of data as the API scales, using cloude computing and storage and rapid development: If you are developing using modern agile methodologies, A NoSQL database doesn’t require the level of preparation typically needed for relational databases; <br/>
"swagger-ui-express": it let's generate interactive API documentation that lets your users try out the API calls directly in the browser.  <br/>

### devDependencies: 
- chai: is an assertion library. Usually used to expect some answers of our tests; <br/>
- chai-http: " provides an interface for live integration testing by making assertions for common http tasks; <br/>
- mocha: is a test runner. This just means that it is a tool that runs and executes our tests. The tests themselves aren’t written in Mocha. Other test runners include Jasmine, Jest; <br/>
- mongodb-memory-server: it enables us to start a mongod process that stores data in memory. It is a package that spins up a real MongoDB server; <br/>
- nodemon: simple monitor script for use during development of a node.js app; <br/> 
- sinon: provides stand-alone test spies, stubs, and mocks; <br/>

## Integration tests:
Integration tests can be checked by calling 'npm test' on root folder on your terminal.

Have fun =)
