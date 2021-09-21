{
    /// <binding AfterBuild='default' Clean='clean' />
    /*
    This file is the main entry point for defining Gulp tasks and using Gulp plugins.
    Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
    */

    const del = require('del');
    const gulp = require('gulp');
    const uglifyes = require('uglify-es');
    const composer = require('gulp-uglify/composer');
    const uglify = composer(uglifyes, console);

    var paths = {
        scripts: ['scripts/**/*.js'],
        styles: ['styles/**/*.css', 'styles/**/*.ttf'],
    };

    gulp.task('clean', function () {
        return del(['wwwroot/scripts/**/*']);
    });

    gulp.task('default', function () {
        gulp.src(paths.scripts).pipe(uglify()).pipe(gulp.dest('wwwroot/scripts'));
        gulp.src(paths.styles).pipe(gulp.dest('wwwroot/styles'));
    });
}