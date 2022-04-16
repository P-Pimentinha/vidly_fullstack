const bcrypt = require('bcrypt');

async function run() {
    const salt = await bcrypt.genSalt(15);
    const hashed = await bcrypt.hash('pedro', salt);
    console.log(salt);
    console.log(hashed);
}

run();

