var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");
const express = require("express");
var LineStrategy = require('passport-line').Strategy;

const cors = require("cors");

const CLIENT_PORT = "http://localhost:3002";

const ngrok = "https://fe5e5a8a3c6f.ngrok.io";

const ID = "1654480826";

const SECRET_ID = "905f7033276be3710802f3fae0b1dbeb";

const dbport = 6000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: CLIENT_PORT,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.static("client"));
app.use(express.json());

app.listen(dbport, () => console.log(`Server started on port ${dbport}`));

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new LineStrategy(
    {
      channelID: ID,
      channelSecret: SECRET_ID,
      callbackURL: `${ngrok}/auth/line/callback`,
      scope: ["profile", "photos", "openid", "email"],
      botPrompt: "normal",
    },
    function(accessToken, refreshToken, profile, done) {
        //ส่วนนี้จะเอาข้อมูลที่ได้จาก facebook ไปทำอะไรต่อก็ได้
        done(null, profile,)
      }
  )
);

app.get('/logout', (req, res) => { req.logout(); res.redirect(CLIENT_PORT); })

app.get("/", (req, res) => { res.send("please login") });

app.get("/auth/line", passport.authenticate("line"));

app.get("/auth/line/callback", passport.authenticate("line", { failureRedirect: "/", successRedirect: CLIENT_PORT } ));

app.get('/login/success', (req, res) => { 
    if (req.user) {
      console.log(req.user)
      res.json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
        cookies: req.cookies
      });
    }
  })
