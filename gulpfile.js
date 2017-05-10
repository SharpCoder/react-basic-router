const gulp = require('gulp');
const concat = require('gulp-concat');
const del = require('del');
const babel = require('gulp-babel');

gulp.task('concat', () => {
  return gulp.src(['src/global.jsx', 'src/router.jsx', 'src/route.jsx', 'src/errorRoute.jsx'])
    .pipe(concat('testfile.jsx'))
    .pipe(gulp.dest('.'));
});

gulp.task('compile', ['concat'], () => {
  return gulp.src('testfile.jsx')
    .pipe(babel({
      presets: [ 'es2015', 'react' ]
    }))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('clean', ['compile', 'concat'], () => {
  // return del(['all.jsx']);
});

gulp.task('default', ['clean']);
