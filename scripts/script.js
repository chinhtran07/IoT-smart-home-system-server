const bcrypt = require('bcryptjs');

bcrypt.genSalt(10).then(async (salt) => {
    const password = await bcrypt.hash("123456", salt);
    console.log(password);
});

