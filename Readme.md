1. install npm -> "npm init -y"
2. install express -> "npm i express"
3. install dotenv -> "npm i dotenv"
4. create server.js in main folder
5. create src folder and create app.js
6. connect mongodb atlas, create cluster, take username and password and store it in .env, open campass mongoDb
7. install mongoose 



=========================================================================
# app.js 
-its used for two purpose 
1 server instance is created here but server is runned on server.js
2 server config 
    ->all middlewares
    ->all api are conected here
=========================================================================
# here we will use require and module instead of import & export
bsz as most of the old companies use old format
both are same 
=========================================================================
1. # "dev":"npx nodemon server.js" 
    - nodemon is used to observe changes and restart the server instead of everytime manullay after updating the code
    - used mainly in devolpment phase
2.  # "start":"node server.js"
    - its just starting server but can not tackle any changes/updates 
    - everytime manually need to stop and rerun it
    - mainly used in production level after development
3. # error in exporting module outside
    -if u now run it will not come and shows error bsz by default in package.josn type is "COMMONJS" but for that we have to use "require"
    -but if we use import export then we need to change type to "module"
=========================================================================
# mongoose 
- it is the pacakage used to handle mongoDb, to store schema, data
=========================================================================
# dotenv
- file where all secrets/sensitive data are stored
=========================================================================
# db file
- create db folder and a file in it 
- import mongoose here as it will connect server to DB
# 
- import app in server and import dotenv from dotenv and also config dotenv

dotenv.config({
    path:"..."
})
=========================================================================
# creating models

1. create user schema and take fields
2. using pre - mongoose middleware , hash the password