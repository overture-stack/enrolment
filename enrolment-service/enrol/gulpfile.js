var gulp = require("gulp");
var shell = require("gulp-shell");

gulp.task("run-tests", shell.task(["python manage.py test core/api_tests/"]));

gulp.task("watch", function() {
  gulp.watch(["./**/*.html", "./**/*.py"], ["run-tests"]);
});

gulp.task("default", ["run-tests", "watch"]);
