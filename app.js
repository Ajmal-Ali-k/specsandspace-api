const express = require("express");
const http = require("http");
var session = require("express-session");
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const passport = require('passport');
const server = http.createServer(app);


app.use(cookieParser());

//express session middleware calling
app.use(
  session({
    secret: "key",
    cookie: { maxAge: 1000 * 60 * 60 },
    saveUninitialized: true,
    resave: false,
  })
);
const dotenv = require("dotenv");
//dotenv config
dotenv.config();

// Parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const connectDB = require("./config/db");
//mongodb connection
connectDB();

//middlewares
app.use(express.json());
app.use(passport.initialize());

app.use(morgan("dev"));
app.use('/api', express.static('public'));
// cors
app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );
  
  
  const port = 8080;
  //listen port
  server.listen(port, () => {
    console.log(
      `server running in ${port} Mod on port ${port}`
        .bgCyan.white
    );
  });
  
  const userRouter = require("./routes/router");
  app.use("/api", userRouter);