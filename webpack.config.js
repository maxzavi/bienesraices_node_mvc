import path from 'path'
export default {
    mode: 'development',
    entry:{
        map: './src/js/map.js',
        addImage: './src/js/addImage.js',
        showmap: './src/js/showmap.js'
    },
    output:{
        filename: '[name].js',
        path:  path.resolve ('public/js')
    }
    
}