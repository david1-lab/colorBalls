const   express                 =   require("express"),
        app                     =   express(),
        mongoose                =   require("mongoose"),
        passport                =   require("passport"),
        LocalStrategy           =   require("passport-local"),
        passportLocalMongoose   =   require("passport-local-mongoose"),
        flash                   =   require("connect-flash"),
        createError             =   require('http-errors'),
        path                    =   require('path'),
        cookieParser            =   require('cookie-parser'),
        logger                  =   require('morgan'),
        indexRouter             =   require('./routes/index'); //index Route


// Configurations
// mongoose
mongoose.connect("mongodb://localhost/color_balls");
// express-session
app.use(require("express-session")({
    secret: "Color teaches love",
    resave: false,
    saveUninitialized: false
}));


// models
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", userSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware
app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
