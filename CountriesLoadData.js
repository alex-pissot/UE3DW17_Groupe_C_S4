var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing countries into DynamoDB. Please wait.");

var allCountries = JSON.parse(fs.readFileSync('countries.json', 'utf8'));
allCountries.forEach(function(country) {
    var params = {
        TableName: "Countries",
        Item: {

            "region":  country.region,
            "nom": country.name.common,
            "capital":  country.capital,
            "langues":  country.languages,
            "superficie":  country.area
            
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add country", country.name.common, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", country.name.common);
       }
    });
});