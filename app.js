if (process.env.NODE_ENV != "Production"){
require("dotenv").config() 
};

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


const DbUrl = process.env.ATLASDB_URL;
const store =  MongoStore.create({
    mongoUrl:DbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*36000,
});

store.on("err",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUnitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



main()
.then( () =>{
    console.log("database connected")
})
.catch((err) =>{
    console.log(err)
});

async function main(){
    await mongoose.connect(DbUrl);
};



// app.get("/",(req,res) =>{
//     res.send("home page of wanderlust");
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
 

   app.use("/listing", listingRouter);
   app.use("/listing/:id/reviews", reviewRouter);
   app.use("/", UserRouter);


  
app.use((err,req,res,next) =>{
    let{ statusCode = 500,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{ err});
    
});
app.all("/{*any}",(req,res,next) =>{
    next(new ExpressError("page not found",404));
});  


app.listen(8080, () =>{
    console.log("listen on port 8080")
});

