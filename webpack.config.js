var webpack           = require('webpack');
var path              = require('path');
var glob              = require('glob');

function getEntry() {
    var entry = {};
    // var nLength = sSystem.length - 1;
    var srcDirName = './src/**/*.js'; //需要获取的文件路径
    
    glob.sync(srcDirName).forEach(function (name) {
        //name:./src/ovdream/basic/member/index/index.js
        
        //裁剪路径
        // var n = name.slice(name.lastIndexOf(sSystem) + nLength, name.length - 3);
        //n:/member/index/index
        var n = name.slice(name.lastIndexOf('/'),name.length-3);
        //n:/member/index
        
        entry[n] = name;
        
        // if(sSystem==='mobile/'){
        //     //此处可引入第三方库文件等需要打包成公共模块的文件
        //     entry['vendor/vendor']=['./src/ovdream/global/global.css'];
        // }else{
        //     entry['vendor/vendor']=['./src/ovdream/global/global.js','./src/libs/layer/need/layer.css',;
        // }
    });
    return entry;
}

module.exports={
    entry:getEntry(),
    output: {
        path: path.join(__dirname, "dist/js/"),
        publicPath: "dist/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    }
}