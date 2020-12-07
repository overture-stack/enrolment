const {
    series,
    watch,
} = require("gulp");
const shell = require("gulp-shell");

const runTests = async function() {
    return shell(["python manage.py test core/api_tests/"]);
}

const watchFiles = function() {
  watch(["./**/*.html", "./**/*.py"], runTests);
};

exports['run-tests'] = runTests;

exports.default = series(runTests, watchFiles);
