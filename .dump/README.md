# Importing Database Environment

To bootstrap the application and start your dev/test process, we provide a ready-to-import database dump located at .dump/db.
Please, follow these steps to import the dump:

- Start MongoDB database server if not running : `mongod`
- Start MongoDB console : `mongo` and switch to hrms db using the command `use hrms`
- Still using the mongodb console, drop the current db by executing the command `db.dropDatabase()`. (you can close the console right after)
- Start the dump import utility using command : `mongorestore.exe --db hrms {project-root}\.dump\db\hrms` 

# Importing Postman Environment

We provide a postman ready environement for API-testing, to import the environement please follow these steps:
- Go to File -> Import
- Choose file .dump/postman.json

**Features:**
- An in-ready token synchronization script shared between all API requests.
- A collection classified requests
