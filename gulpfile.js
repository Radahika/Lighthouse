var gulp = require("gulp");
var concat = require("gulp-concat");

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
});
