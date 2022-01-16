var express = require('express');
var router = express.Router();


var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UE 3DW16' });
});

/* Pays Euro */
router.get("/payseuro", function (req, res) {
    var params = {
        TableName: "Countries",
        ProjectionExpression: "nom",
        KeyConditionExpression: "#reg = :region",
        ExpressionAttributeNames: {
            "#reg": "region",
        },
        ExpressionAttributeValues: {
            ":region": "Europe",
        },
    };
    docClient.query(params, function (err, data) {
        res.render("payseuro", {
            "payseuro": data.Items,
        });
    });
});
/* Noms et superficie des pays africains triés par superficie de la 10ème à la 22ème position*/
router.get("/trier", function (req, res) {
    var params = {
        TableName: "Countries",
        ProjectionExpression: "#rg, nom, superficie",
        FilterExpression: "#rg = :region and #super > :value",
        ExpressionAttributeNames: {
            "#rg": "region",
            "#super": "superficie",
        },
        ExpressionAttributeValues: {
            ":region": "Africa",
            ":value": 0,
        },
        Limit: 12,
    };
    docClient.scan(params, function (err, data) {
      res.render("trier", {
          "trier": data.Items,
      });
  });
});
/* Info one country */

router.get("/onecountry", function (req, res) {
  var params = {
    TableName : "Countries",
    FilterExpression: "#nm = :nom",
    ExpressionAttributeNames:{
        "#nm": "nom"
    },
    ExpressionAttributeValues: {
        ":nom": "France"
    }
  };
  docClient.scan(params, function (err, data) {
      console.log(data.Items);
      res.render("onecountry", {
          "country": data.Items[0],
      });
  });
});

/* Countries starting with an M */

router.get("/startWithM", function (req, res) {
    var params = {
        TableName: "Countries",
        FilterExpression: "#n between :start_letter and :end_letter",
        ExpressionAttributeNames: {
            "#n": "nom",
        },
        ExpressionAttributeValues: {
            ":start_letter":"M",
            ":end_letter":"N",
        },
    };
    docClient.scan(params, function (err, data) {
        console.log(data.Items);
        res.render("startWithM", {
            "country": data.Items,
        });
    });
});

/* Countries with area between 400 000 and 500 000 km2 */

router.get("/area", function (req, res) {
    var params = {
        TableName: "Countries",
        FilterExpression: "#s between :start_number and :end_number",
        ExpressionAttributeNames: {
            "#s": "superficie",
        },
        ExpressionAttributeValues: {
            ":start_number":400000,
            ":end_number":500000,
        },
    };
    docClient.scan(params, function (err, data) {
        console.log(data.Items);
        res.render("area", {
            "country": data.Items,
        });
    });
});

module.exports = router;
