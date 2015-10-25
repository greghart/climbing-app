gulp = require 'gulp'
src = gulp.src
dest = gulp.dest
gutil = require 'gulp-util'
uglify = require 'gulp-uglify'
concat = require 'gulp-concat'
less = require 'gulp-less'
compressor = require 'gulp-compressor'
autoprefixer = require 'gulp-autoprefixer'
webpack = require 'webpack'
GulpHelper = require 'gulp-cs-helper'

GulpHelper.help gulp,
  src: './src/**/*.@(coffee|cjsx|js)'
  dir: './dist'

gulp.task 'coffee', gulp.coffee

# Stitch and minify JS lib
js = [
  'node_modules/jquery/dist/jquery.js'
  'node_modules/bootstrap/dist/js/bootstrap.js'
  'node_modules/leaflet/dist/leaflet.js'
  'node_modules/leaflet-providers/leaflet-providers.js'
]
gulp.task 'js', ->
  stream = src(js)
  .pipe(uglify())
  .pipe(concat('lib.min.js'))
  .pipe(dest('./build/js/'))

config = require './webpack.config.js'
gulp.task 'webpack', (cb) ->
  webpack config, (err, stats) ->
    throw new gutil.PluginError('webpack', err) if err?
    gutil.log('[webpack]', stats.toString())
    cb()

# Stich and minify less
css = [
  'src/assets/css/*.@(less|css)'
  'node_modules/bootstrap/less/bootstrap.less'
  'node_modules/leaflet/dist/leaflet.css'
]

gulp.task 'css', ->
  stream = src(css)
  .pipe(less())
  .pipe(compressor({executeOption: {maxBuffer: 1000 * 1024}})) # Update this if you start getting 'maxBuffer exceeded' errors
  .pipe(concat('lib.min.css'))
  .pipe(dest('./build/css/'))
  .on('error', (err) -> console.error err)

img = [
  'src/assets/img/*.png'
]

gulp.task 'img', ->
  stream = src(img)
  .pipe(dest('./build/img/'))

gulp.task 'build', ['js', 'webpack', 'css', 'img']

gulp.task 'watch', ->
  gulp.watch js, ['js']
  gulp.watch css, ['css']

gulp.task 'default', ['build', 'watch']