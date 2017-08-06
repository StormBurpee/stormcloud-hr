var gulp = require('gulp');

gulp.task('default', ['build-server', 'build-client']);

gulp.task('build-server', function() {
  gulp.src('src/server/*')
  .pipe(gulp.dest('build/server'));
  gulp.src('src/server/**/*')
  .pipe(gulp.dest('build/server'));
});

gulp.task('build-client', ['client-angular']);

gulp.task('client-angular', function(){

});
