const sendEmail = require("./ses");
sendEmail("reichlej@gmx.de", "Hi There", "IT WORKS ")
    .then((res) => {
        console.log("SUCCESS", res);
    })
    .catch((e) => {
        console.log("ERROR", e);
    });
