var express    = require("express");
var login = require('./routes/loginroutes');
var upload = require('./routes/fileroutes');
var bodyParser = require('body-parser');
/*
Module:multer
multer is middleware used to handle multipart form data
*/
var multer = require('multer');
var multerupload = multer({ dest: 'fileprint/' })
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Origin', '*'); //replace localhost with actual host
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');

    next();
});
var router = express.Router();

// test route
router.get('/', function(req, res) {
    res.json({ message: 'welcome to our upload module apis' });
});

//route to handle user registration
router.post('/register',login.register);
router.post('/login',login.login);
//route to handle file printing and listing
router.post('/fileprint',multerupload.any(),upload.fileprint);
router.get('/fileretrieve',upload.fileretrieve);

router.get('/getExpense', login.getExpense)
router.post('/postExpense', login.postExpense)
router.put('/action', login.action)

router.get('/customerNames', login.customerNames)

router.get('/customerNamesLocation', login.customerNamesLocation)
router.get('/projectNames', login.projectNames)
router.get('/projectCodes', login.projectCodes)


router.post('/addCustomerName', login.addCustomerName)
router.post('/addLocation', login.addLocation)
router.post('/addProjectName', login.addProjectName)
router.post('/addProjectCode', login.addProjectCode)

app.use('/api', router);
app.listen(8000);