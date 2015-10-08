var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");

var autoprefixer = require("gulp-autoprefixer");
var sass = require("gulp-sass");
var source = require("vinyl-source-stream");

var babelify = require("babelify");
var browserify = require("browserify");
var watchify = require("watchify");

var production = process.env.NODE_ENV === "production";

var dependencies = [
  "react",
  "underscore",
];

// Combine JS libraries into a single file for fewer http requests

gulp.task("vendor", function () {
  return gulp.src([
    "bower_components/jquery/dist/jquery.js",
    "bower_components/bootstrap/dist/js/bootstrap.js",
  ])
  .pipe(concat("vendor.js"))
  .pipe(gulp.dest("public/js"));
});

// Compile third-party dependencies separately

gulp.task("browserify-vendor", function () {
  return browserify()
  .require(dependencies)
  .bundle()
  .pipe(source("vendor.bundle.js"))
  .pipe(gulp.dest("public.js"));
});

// Compile only project files, excluding third-party dependencies.

gulp.task("browserify", ["browserify-vendor"], function () {
  return browserify("app/main.js")
  .external(dependencies)
  .transform(babelify)
  .bundle()
  .pipe(source("bundle.js"))
  .pipe(gulp.dest("public.js"));
});

// Same as browserify, but also watches for changes and recompiles.

gulp.task("browserify-watch", ["browserify-vendor"], function () {
  var bundler = watchify(browserify("app/main.js", watchify.args));
  bundler.external(dependencies);
  bundler.transform(babelify);
  bundle.on("update", rebundle);
  return rebundle();

  function rebundle () {
    var start = Date.now();
    return bundler.bundle()
    .on("error", function (err) {
      gutil.log(gutil.colors.red(err.toString()));
    })
    .on("end", function () {
      gutil.log(gutil.colors.green("Finished rebundling in", (Date.now() - start) + "ms."));
    })
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("public/js/"));
  }
});

// Compile stylesheets
gulp.task("styles", function () {
  return gulp.src("app/stylesheets/main.scss")
  .pipe(sass().on("error", sass.logError))
  .pipe(autoprefixer())
  .pipe(gulp.dest("public/css"));
});

gulp.task("watch", function () {
  gulp.watch("app/stylesheets/**/*.scss", ["styles"]);
});

gulp.task("default", ["styles", "vendor", "browserify-watch", "watch"]);
gulp.task("build", [ "styles", "vendor", "browserify" ]);
