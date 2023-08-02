const http = require('https');
const fs = require('fs');

var download = async (url, dest, cb) => {
    return new Promise((resolve, reject) => {
        var file = fs.createWriteStream(dest);
        file.on('finish', function () {
            file.close(cb);  // close() is async, call cb after close completes.
        });
        console.log(url);
        http.get(url, function (response) {
            response.pipe(file);
            resolve();
        }).on('error', function (err) { // Handle errors
            fs.unlink(dest);
            if (cb) cb(err.message);
            reject();
        });
    })

};

const main = async () => {
    const url = "https://sorare.com/assets"
    const files = fs.readdirSync("./js");
    for (let file of files) {
        if (file.endsWith(".js")) {
            var map_file = file + ".map";
            if (!fs.existsSync("js/" + map_file)) {
                await download(url + "/" + map_file, "js/" + map_file);
            }
        }
    }
    console.log("************************download finish!*******************************")

};

main();
