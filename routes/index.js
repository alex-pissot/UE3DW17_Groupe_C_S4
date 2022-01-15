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
  res.render('index', { title: 'Express' });
});

/* Pays Euro */
// router.get('/payseuro', function(req, res) {
//   var params = {
//     TableName : "Countries",
//     ProjectionExpression: "nom",
//     ExpressionAttributeValues: {
//         ":region": "Europe"
//     }
//   };
//   docClient.query(params, function(err, data) {
//     res.render('payseuro', {
//       "payseuro" : data.Items
//     });
//   });
// });

/* Info one country */

router.get("/onecountry", function (req, res) {
  var params = {
      TableName: "Countries",
      FilterExpression: "#n = :nom",
      ExpressionAttributeNames: {
          "#n": "nom",
      },
      ExpressionAttributeValues: {
          ":nom": "France",
      },
  };
  docClient.scan(params, function (err, data) {
      console.log(data.Items);
      res.render("onecountry", {
          country: data.Items[0],
      });
  });
});


module.exports = router;

