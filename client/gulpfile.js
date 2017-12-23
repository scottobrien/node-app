var gulp = require('gulp');
// var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

// gulp.task('scss', function() {
//   return gulp.src('assets/styles/scss/site.scss')
//     .pipe(sass() .on('error', sass.logError))
//     .pipe(gulp.dest('./assets/styles/'))
//     .pipe(browserSync.stream());
// });

gulp.task('serve', function() {
  browserSync.init({
    server: './'
  });
  // gulp.watch('./assets/styles/scss/**', ['scss']);
  gulp.watch('./*.html').on('change', browserSync.reload);
});


gulp.task('default', ['serve']);