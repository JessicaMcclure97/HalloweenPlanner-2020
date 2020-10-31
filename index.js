const fs = require('fs');

const express = require('express');
const session = require('express-session');

const app = express();
const port = 8080;

app.use(session({secret:'0b1f608ad333a1911f6851e2c2a183496739fecc36cffe347d4f1c563319c8d0f0d1bac720267863b4e0f9ab928a1ecd40e7d93aeaf65d5e79479b3278b9894b'}));
let ssn;

app.post('/api/login', async function (req,res) {
    ssn=req.session;

    if (!ssn.name) {
        ssn.name = "banana";
        res.send("Logged out.");
    } else {
        res.send("Logged in with ID " + ssn.name);
    }
});
app.post('/HalloweenPlanner-2020/api/plan', function (req,res) {
    let html = "good"; //validation

    console.log('post: ' + req.url);
    req.setEncoding('utf8');
    req.on('data', chunk => {
        console.log('Got a line of post data: ', chunk);
        html = processForm( chunk, res ); //Server side validation
    })

    req.on('end', () => {
        console.log('End of Data - sending reply');
        if (html === "good"){
            writeJSON(res);
            res.end();
        }else{
            //unsuccessful validation
            res.end();
        }
    })
});

app.get('/HalloweenPlanner-2020', function(req,res){
    console.log("Get Form html");
    res.sendFile('index.html', {root: __dirname });
    res.end();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
//////////////FORM/////////////////////

let formInputs = new Map();

//validating form
function processForm(chunk, res){
    var objects = chunk.split("&");

    for(var i = 0; i < objects.length-1; i++){ //-1 since submit button will always be there
        var info = objects[i].split("=");
        info[1] = info[1].replace(/[+]/g, ' ');
        //validating fields
        if(false){ //form validation later - !formValidation(info[0], info[1])
            return "<script>alert(\"Cannot Process form. Please press the " +
                "back button to return to the order form.\");</script>";
        }else{
            formInputs.set(info[0], info[1]);
        }
    }
    return "good";
}

function writeJSON(res){
    var obj = "{";
    for (const [key, value] of formInputs.entries()) {
       obj += "" +key+ ":" + value+",";
    }
    obj += "}";

    let data = JSON.stringify(obj);
    console.log(data);

    res.json(data);
}
