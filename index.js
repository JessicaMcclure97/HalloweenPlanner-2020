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
app.post('/api/plan', function (req,res) {
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
            console.log("Unsuccessful Form");
            //unsuccessful validation
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(String(html));
            res.end();
        }
    })
});

app.use(express.static('static'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
//////////////FORM/////////////////////

let formInputs = new Map();

//validating form
function processForm(chunk, res){
    var objects = chunk.split("&");

    var valid = true;

    for(var i = 0; i < objects.length; i++){ //-1 since submit button will always be there
        var info = objects[i].split("=");
        info[1] = info[1].replace(/[+]/g, ' ');

        //validating fields
        valid = formValidation(info[0], info[1]);
        if(!valid){
            console.log(info[0]);
           break;
        }else{
            formInputs.set(info[0], info[1]);
        }
    }

    if(peopleCount != noNames) valid = false;
    if(!valid){
        return "<script>alert(\"Cannot Process form. Please press the " +
            "back button to return to the order form.\");</script>";
    }else{
        return "good";
    }
}

let peopleCount;
let noNames = 0;

function formValidation(key, value){
    switch (key){
        case "peopleCount":
            value = parseInt(value);
            if(value < 1 || value > 6){
                return false;
            } else {
                peopleCount = value;
            }
            break;
        case "startTime":
            if(!value.match(/[0-2][0-9]%3A[0-5][0-9]/)){
                return false;
            }
            break;
        case "endTime":
            if(!value.match(/[0-2][0-9]%3A[0-5][0-9]/)) return false;
            break;
        case "drinkingGames":
            break;
        case "familyFriendly":
            break;
        default:
            if(!value.match(/[a-zA-Z0-9A-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ0-9.()\s-]+/)){
                if(value == ""){
                    //do nothing
                }else{
                    return false;
                }
            } else {
                noNames ++;
            }
            break;
    }

    return true;
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
