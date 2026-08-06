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
2. using pre - mongoose middleware , hash the password , userschema.methods.isPasswordCorrect , accessToken and refreshToken generations

-> bcrypt - install "npm i bcryptjs" to hash passwords : bcrypt.hash(pass,salt)
    1. it takes password and salts (which adds complexity and depends on computation power)
    2. lets say user1-pass: hello123
                user2-pass: hello123
        hashing(user1-pass,user2-pass)=same but based on salts context matters and changes
        -> user1:salt:10 (random string :- xyz@123)
        -> user2.salt:12 (random string :- abc%32@)
        * now hash(user1-pass,user1-salt)!= hash(user2-pass,user2:salt)

-> jsonwebtoken - install for accessToken and refreshToken
    1. it takes payload i.e data 
    2. secret password
    3. expires

-> cookie-parser : after generating passwords we will send them/store in cookies 

* cookie-parser dont help in creating cookies but helps in reading it and putting it into req.cookes. same like express.json() as we used to take data and structurize in form of object similarly cookie-paser take data in the form of stering and converts it into cookie object which can be retrived using re.cookies

==========================================================================
# define ApiError and ApiResponse and asyncHandler 

- define and customize above things for the handling Api's.
- create auth controller / user controller , auth routes
==========================================================================
# authcontroller

- sometimes we take data/info from user in req.body but express cant take raw data or json files so we use "app.use(express.json())"
     -- simply express server cannot directly read info passed on req.body so we will use ...
