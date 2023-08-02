const fs = require("fs");
const child_process = require("child_process");

const execCommand = (cmd) => {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
};

const main = async () => {
  const files = fs.readdirSync("./js");
  fs.mkdirSync("src");

  for (let file of files) {
    if (file.endsWith(".map")) {
      console.log(file);
      try {
        const output = "target_" + file;
        await execCommand(`unpack ${output} ./js/${file}`);
        fs.cpSync(output, "src", { recursive: true });
        fs.rmdirSync(output, { recursive: true, force: true });
      } catch (err) {
        console.error(err);
      }
    }
  }
};

main();
