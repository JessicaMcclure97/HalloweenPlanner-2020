const express = require('express');
const session = require('express-session');

const app = express();
const port = 22224;

app.use(session({secret:'0b1f608ad333a1911f6851e2c2a183496739fecc36cffe347d4f1c563319c8d0f0d1bac720267863b4e0f9ab928a1ecd40e7d93aeaf65d5e79479b3278b9894b'}));
let ssn;

app.post('/login', async function (req,res) {
    ssn=req.session;

    if (!ssn.name) {
        ssn.name = "banana";
        res.send("Logged out.");
    } else {
        res.send("Logged in with ID " + ssn.name);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})