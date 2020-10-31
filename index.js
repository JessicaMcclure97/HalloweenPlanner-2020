const fs = require('fs');
const express = require('express');

const app = express();
const port = 8080;


////////////// Import Data CSVs //////////////

function csvFileToObjectArray(path) {
    const array = [];

    fs.readFile(path, function (err, data) {
        if (err) throw err;

        data = data.toString();
        data = data.split("\r\n")

        // first row of file is headers - get header lines and then remove from array
        const headers = data[0].split(",");
        data.shift();

        data.forEach(function (item) {
            item = item.split(",");

            const object = {};
            for (let j = 0; j < headers.length; j++) {
                object[headers[j]] = item[j];
            }

            array.push(object);
        });
    });

    return array;
}

const costumes = csvFileToObjectArray("data/costumes.csv");

////////////// Generating Plan Elements //////////////

function generateCostume(groupSize) {
    const possibilities = [];

    costumes.forEach((item) => {
       if (item.min <= groupSize && item.max >= groupSize) {
           possibilities.push(item);
       }
    });

    const randomIndex = Math.floor(Math.random() * possibilities.length);
    return possibilities[randomIndex];
}

////////////// Planning API //////////////

app.post('/api/plan', function (req,res) {
    let formInputs = new Map();
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
            writeJSON(res, formInputs);
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

function writeJSON(res, formInputs){
    var obj = "{";
    for (const [key, value] of formInputs.entries()) {
       obj += "" +key+ ":" + value+",";
    }
    obj += "}";

    let data = JSON.stringify(obj);
    console.log(data);
    res.json(data);
}

///////////Create Story//////////////////
function randomStoryGenerator(costume){

    var peopleCount = peopleCount;
    var costumeDescription = costume.costume;
    var evilCharacter = costume.evilCharacter;
    var randomName;
    var randomName2;
    var treasure = costume.treasure;
    var task = costume.task;
    var location = costume.location;



    var story = "Once upon a time there were" + peopleCount + costumeDescription + ". One day they decided to go to "
        + location + ". They thought they were all alone, however "+ evilCharacter +" was looking in. " + evilCharacter +
        " wanted the " + costumeDescription + "'s " + treasure + ". " + evilCharacter + " decided to pose as one of the "
        + costumeDescription + " by kidnapping "+ randomName +"! The other " + costumeDescription + " didn't notice the" +
        " change at all. They started " + task + " at the " + location + " and it was there they noticed how "+
        randomName +" couldn't do anything at all. " + randomName2 + " grew suspicious. The " + costumeDescription +
        " decided to have a meeting. They decided to bombard " +randomName+" with questions. "+randomName2 +" was " +
        "convinced this wasn't really  " + randomName + " and so they decided to kill + " + randomName + "! After they " +
    "decided to look around the "+ location + ". In the back they found the real " + randomName + "! All was well after" +
    " wards as they defeated they " +evilCharacter + " and they lived  happily ever after!"
}

