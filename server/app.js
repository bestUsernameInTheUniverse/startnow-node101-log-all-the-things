const express = require('express');
const fs = require('fs');
// var readline = require('readline');

const app = express();

var routeCounter = 0;

var logPoint = { 
    Agent: "agent",
    Time: "time",
    Method: "method",
    Resource: "resource",
    Version: "version",
    Status: "status"
}

const headers = "Agent,Time,Method,Resource,Version,Status\n";


function collectLogPoint(req) {
    var timeStamp = new Date().toISOString();

    logPoint["Agent"] = req.header('user-agent');
    logPoint["Time"] = timeStamp;
    logPoint["Method"] = req.method;
    logPoint["Resource"] = req.path;
    logPoint["Version"] = "HTTP/" + req.httpVersion;
    logPoint["Status"] = '200';
}


app.use((req, res, next) => {
    if (routeCounter == 0) { //if new log file
        fs.appendFile("./server/log.csv", headers, (err) => {
            if(err) throw err;
            console.log("wrote new file");

            collectLogPoint(req);
            fs.appendFile("./server/log.csv", JSON.stringify(logPoint) + "\n", (err) => {
                if(err) throw err;
                console.log("appended to file:" + routeCounter);
                routeCounter++;
                next();
            })
        })
    } 
    else if (routeCounter >= 20) { //make new log file if log too long
        routeCounter = 0;
        fs.copyFile("./server/log.csv", "./server/log1.csv", (err) => {
            if(err) throw er;
            console.log("file copied");
            fs.unlink("./server/log.csv", (err) => {
                if(err) throw err;
                console.log("log deleted");
                fs.appendFile("./server/log.csv", headers, (err) => {
                    if(err) throw err;
                    console.log("wrote new file");
                    collectLogPoint(req);
                    fs.appendFile("./server/log.csv", JSON.stringify(logPoint) + "\n", (err) => {
                        if(err) throw err;
                        console.log("appended to file:" + routeCounter);
                        routeCounter++;
                        next();
                    })
                 })
            })
        }) 
    }
    else { //add new log line in existing log
        collectLogPoint(req);
        fs.appendFile("./server/log.csv", JSON.stringify(logPoint) + "\n", (err) => {
            if(err) throw err;
            console.log("appended to file:" + routeCounter);
            routeCounter++;
            next();
        })
    }
});


app.get('/', (req, res) => {
    console.log("sending ok");
    res.status(200).send("ok");
});


app.get('/logs', (req, res) => {
    // var logJsonObj = {};
    const csvFilePath='./server/log.csv';

    fs.readFile(csvFilePath, {encoding: "utf8"} , function(err, data){
        if(err) {
            throw err;
            return;
        }

        data = data.split('\n')
        data.shift();
        data.pop()
        data = data.map(object => JSON.parse(object));
        res.send(data);
    })
});


module.exports = app;
