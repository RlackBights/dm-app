const execSync = require("child_process").execSync;

const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('\x1b[91m[ERROR] Please provide a commit message (npm run deploy -- [commit message])\x1b[0m');
} else {
    execSync('react-scripts build && gh-pages -d build -b build', { stdio: [0, 1, 2] });
    execSync(`git add . && git commit -m "${args.join(' ')}" && git push`, { stdio: [0, 1, 2] });
}