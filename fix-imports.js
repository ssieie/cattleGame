const fs = require("fs");
const path = require("path");

function fixImports(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      fixImports(filePath);
    } else if (file.endsWith(".js")) {
      let content = fs.readFileSync(filePath, "utf8");
      content = content.replace(/(from\s+["']\.\/[^"']+)(["'])/g, "$1.js$2");
      fs.writeFileSync(filePath, content, "utf8");
    }
  });
}

fixImports(path.resolve(__dirname, "dist"));
console.log("✅ Import paths fixed.");
