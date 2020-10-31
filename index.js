const fs = require('fs');

const express = require('express');

const app = express();
const port = 8080;

////////////// Import Data CSVs //////////////

const costumes = [];
fs.readFile('data/costumes.csv', (err, data) => {
    if (err) throw err;
    data = data.toString();
    data = data.split("\r\n")
    // remove first line - titles
    data.shift();

    data.forEach((item) => {
        item = item.split(",");

        costumes.push({
            min: item[0],
            max: item[1],
            costume: item[2]
        });
    });
});

////////////// Planning API //////////////

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

app.use(express.static('static'));

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
