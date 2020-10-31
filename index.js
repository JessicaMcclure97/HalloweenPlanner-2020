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

function generatePlan(data) {
    const plan = new Map();

    let costume = generateCostume(data.get("peopleCount"));
    plan.set("costume", costume["costume"]);

    let story = randomStoryGenerator(data.get("peopleCount"), data.get("name0"), data.get("name1"), costume);
    plan.set("story", story);

    return plan;
}

app.post('/api/plan', function (req,res) {
    console.log('post: ' + req.url);
    req.setEncoding('utf8');
    req.on('data', chunk => {
        console.log('Got a line of post data: ', chunk);
        processForm( chunk, res ); //Server side validation
    })
});

app.use(express.static('static'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
//////////////FORM/////////////////////

//validating form
function processForm(chunk, res){
    let objects = chunk.split("&");
    let valid = true;
    let formInputs = new Map();

    for(let i = 0; i < objects.length; i++){ //-1 since submit button will always be there
        let info = objects[i].split("=");
        info[1] = info[1].replace(/[+]/g, ' ');

        //validating fields
        valid = formValidation(info[0], info[1]);
        if (valid) {
            formInputs.set(info[0], info[1]);
        } else {
            break;
        }
    }

    if(peopleCount != noNames) valid = false;

    if (valid) {
        writeJSON(res, generatePlan(formInputs));
        res.end();
    } else {
        console.log("Unsuccessful Form");
        // unsuccessful validation
        res.writeHead(400);
        res.end();
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

function writeJSON(res, data){
    var obj = "{";
    for (const [key, value] of data.entries()) {
       obj += "" +key+ ":" + value+",";
    }
    obj += "}";

    let jsonData = JSON.stringify(obj);
    console.log(jsonData);
    res.json(jsonData);
}

///////////Create Story//////////////////
function randomStoryGenerator(peopleCount, randomName, randomName2, costume){
    var costumeDescription = costume["costume"];
    var evilCharacter = costume["evilCharacter"];

    var treasure = costume["treasure"];
    var task = costume["task"];
    var location = costume["location"];

    if(randomName2 === ""){
        randomName2 = "Bob";
    }


    var story = "Once upon a time there were " + peopleCount +" " + costumeDescription + ". One day they decided to go to "
        + location + ". They thought they were all alone, however "+ evilCharacter +" was looking in. " + evilCharacter +
        " wanted the " + costumeDescription + "'s " + treasure + ". " + evilCharacter + " decided to pose as one of the "
        + costumeDescription + " by kidnapping "+ randomName +"! The other " + costumeDescription + " didn't notice the" +
        " change at all. They started " + task + " at the " + location + " and it was there they noticed how "+
        randomName +" couldn't do anything at all. " + randomName2 + " grew suspicious. The " + costumeDescription +
        " decided to have a meeting. They decided to bombard " +randomName+" with questions. "+randomName2 +" was " +
        "convinced this wasn't really  " + randomName + " and so they decided to kill " + randomName + "! After they " +
    "decided to look around the "+ location + ". In the back they found the real " + randomName + "! All was well after" +
    "wards as they defeated " +evilCharacter + " and they lived  happily ever after!"

    return story;
}

