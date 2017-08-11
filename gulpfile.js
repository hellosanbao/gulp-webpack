// 载入外挂
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    babel = require('gulp-babel'),
    cssmin = require('gulp-minify-css'),
    jsmin = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	htmlmin = require('gulp-htmlmin'),
	clean = require('gulp-clean'),
	sequence = require('gulp-sequence'),//gulp命令异步执行
    webpack = require('webpack'), //require('webpack-stream')
    webpackConfig = require('./webpack.config.js'),
    fileinclude = require('gulp-file-include')

//html
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input checked/>
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('src/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist'));
});
 
// 样式
gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist'));
});

//js-es6
gulp.task('script',function(){
	gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ["es2015", "stage-2"]  //stage-2解决对象展开表达式编译失败
        }))
        // .pipe(jsmin())
        .pipe(gulp.dest('./dist'))

})

//图片
gulp.task('img',function(){
    gulp.src('src/**/*.{png,jpg,gif,ico}')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./dist'))
})

//用于在html文件中直接include文件
gulp.task('fileinclude', function (done) {
    gulp.src(['src/**/*.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'))
        .on('end', done);
        // .pipe(connect.reload())
});

//清除
gulp.task('clean',function(){
	return gulp.src('./dist')
		.pipe(clean())
})


var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
//使用webpack-stream代替webpack实现实时执行
// gulp.task('webpack', function() {
//   return gulp.src('src/001-lesson/index.js')
//     .pipe(webpack(myDevConfig))
//     .pipe(gulp.dest('dist/'));
// });

gulp.task('webpack',function(){
   devCompiler.run(function(err, stats) {});
})

gulp.task("build-js", ['fileinclude','webpack']);

// gulp.task('default',function(cb){
//     sequence('clean','html','sass','img','build-js')(cb)
// })
 
gulp.task('default',['clean'],function(){
    gulp.start('html','sass','img','build-js')
})

gulp.watch('./src/**/*',['html','sass','img','build-js'])

 