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
* dotenv should be top of the file 
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

=========================================================================
# define ApiError and ApiResponse and asyncHandler 

- define and customize above things for the handling Api's.
- create auth controller / user controller , auth routes
=========================================================================
# authcontroller

- sometimes we take data/info from user in req.body but express cant take raw data or json files so we use "app.use(express.json())"
     -- simply express server cannot directly read info passed on req.body so we will use ...
-> login user 
-> logout user 
    while doing this take user token and block for none to use that token and register or reterive data
-> register user
    both registering and login same time , not first register then login but both at once
=========================================================================
# Nodemailer,Google 0AUTH2 setup 
- followed from anukur prajapati's "difference-backend-repo"
- read blog of nodemailer
1. creating a transporter
2. compose message
3. send the mail

-> getting clientId, clientSecret, refreshToken
=========================================================================
# Account Model, Router, VerifyUser, Controller
- take user id, status, currency 
- build router and then add path in app.js
- check whether user is logged in or not
- in account controller , add createAccount
=========================================================================
# AuthMiddleware

-> check before if user asks for account details / transactions whether user is logged in or not / verified or not
-> verify system user , to send system initial funds

=========================================================================
# Transaction Controller and Router 

- controller should have
   1. validate input info
   2. validate idempotency , check if same exists
        -> if exists then return status of that 
   3. check given to and from accounts are valid and active 
   4. check balance from sender to check (transaction possibilty)
   5. check if amount if valid or not i.e >0
   6. start mongodb session for transactions
   7. ledgerDebitEntry , ledgerCreditEntry
   8. transaction status , make it completed
   9. commit/abort transaction
   10. send trnsaction successful mail

--> MongoDb session 
        startSession() => context
            ↓
        startTransaction() => set of operations under it either all have to pass or neither one makes out
            ↓
        operations => functions that are under one session
            ↓
        commit / abort => if all are passed then commit session 
                       => else abort it i.e all operations are rolled back 
            ↓
        endSession()

    what actually meant by rollback , how -100 later if a operation fails send +100 to sender. how exactly the rollback works?

    -> in one point, with help of session and transaction we will make a virtual or rather temporary changes and store them somewhere , whereas the original money everything is same upto to commit/abort command ,now based on this command it will decide whether to make tempo orignal or discard it
    -> actually , if sender sends 100 then 1000-100=900 is with sender and reciver+100, but if due to any err in later opertions the these new things are not commited , ssimply like whether u save it after modification or dont save it
========================================================================
# blacklist model 
-> create model and we can use to blacklist the already used token 
-> to enhance security

=========================================================================
                        V2
=========================================================================
















=========================================================================
# Things learned from this 

1. Nodemailer
2. Google 0AUTH2
3. MongoDb session
4. blacklisting
5. transactions
6. ledger
=========================================================================
# Feauters added by me

1. resend
    -> after user registration , send verify link to user account and also welcome email

