
var ObjectID = require('mongodb').ObjectID
const MongoClient = require('../../node_modules/mongodb').MongoClient;
const db = require('../../config/db');


module.exports = function(app, db) {

	var currentContent = "";
	var currentTitle = "";


	//Display home page
	app.get('/', (req, res) => {
		console.log('15');

		//Renders index.ejs in vikews directory
		res.render('index');
	});




	//Display list of books being read by user (ListOfBooks.ejs)
	app.get('/Andy/getListOfBooks', (req, res) => {

		//Get information from mLab database
		var collection = db.collection("AndyBookSummaries");


		db.listCollections().toArray(function(err, result) {

		if(err) {
			res.send({ 'error': ' An error has occurred'});
		} else {
			//Render ListOfBooks.ejs in views directory
			res.render('Andy/ListOfBooks', {result: result});
		}
		});
	});


	app.get('/Andy/:name/getNotes/', (req, res) => {
		//Get id from URL
		const name = req.params.name;


		//Find info about book summary based on the object id
		db.collection(name).find({}).toArray((err, BookInfo) => {

			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.render('Andy/BookNotes', {BookInfo: BookInfo, name: name});
			}
		});
	});

	//Display form to create book summary
	app.get('/Andy/getBookForm', (req, res) => {

		res.render('Andy/createBookSummary');

	});

	//Display form to append to book summary
	app.get('/Andy/getAppendForm/:name', (req, res) => {
		const name = req.params.name;
		var collection = db.collection(name);


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('Andy/appendBookSummary', {BookInfo: result, name : name});
			}
		});
	});


	//Display form to append to book summary
	app.delete('/Andy/:name/DeleteCollection', (req, res) => {
			console.log(req.params);
			const name = req.params.name;

			var collection = db.collection(name);
			collection.drop();

			res.redirect('/Andy/getListOfBooks');

	});


	//Delete Note based on id
	app.delete('/Andy/:name/:id', (req, res) => {
		const id = req.params.id;
		const name = req.params.name;

		const details = {'_id': ObjectID(id) };

		db.collection(name).remove(details, (err, item) => {
			if(err) {

				res.send({ 'error': ' An error has occurred'});
			} else {
				console.log('Note delete!');
				res.redirect('/Andy/' + name + '/getNotes/');
			}
		});
	});


	//Create book summary
	app.post('/Andy/createBookSummary', (req,res) => {

		MongoClient.connect("mongodb://andy:test123@ds247688.mlab.com:47688/noteapp", function(err, db) {
			if (err) throw err;
			var dbo = db.db("noteapp");
			dbo.createCollection(req.body.title, function(err, res) {
				if (err) throw err;
				console.log("Collection created!");
				db.close();

			});
			res.redirect('/Andy/getListOfBooks');
		});
});


	//Update book summary based on id
	app.put('/Andy/appendContent/:name', (req, res) => {
		const name = req.params.name;
		//const note = {content: res.content + " " +  req.body.content,title: res.title };




		const note = {content:req.body.content};
		db.collection(name).insert(note, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.redirect('/Andy/' + name + '/getNotes');
			}
		});
	});

























	//Display list of books being read by user (ListOfBooks.ejs)
	app.get('/Austin/getListOfBooks', (req, res) => {

		//Get information from mLab database
		var collection = db.collection("AustinBookSummaries");

		//Returns all info in mLab database into JSON format
		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				//Render ListOfBooks.ejs in views directory
				res.render('Austin/ListOfBooks', {result: result});
			}
		});
	});

	//Get Book summary information based on id
	app.get('/Austin/getBookSummary/:id', (req, res) => {
		//Get id from URL
		const id = req.params.id;

		//Convert id from URL to object ID
		const details = {'_id': new ObjectID(id)};

		//Find info about book summary based on the object id
		db.collection('AustinBookSummaries').findOne(details, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				currentContent = item.content;
				currentTitle = item.title;

				var tempLine = "";
				var oneLineContent = [];
				var lineAmount = 0;

				//currentContent = "abcde\nkdj\nfjkad";
				console.log("currentContent.length is " + item.content.length);
				console.log("currentContent is " + item.content);

				for(var i = 0; i < currentContent.length; i++)
				{
					//console.log('i is ' + i);
					console.log("Checking " + currentContent.substring(i,i+2));
					if(currentContent.substring(i,i+2) != 'zz')
					{
						tempLine += currentContent.substring(i, i + 1);

					}
					else
					{
						console.log("Pushing");
						console.log(tempLine);
						oneLineContent.push(tempLine);
						lineAmount++;
						tempLine = "";
						i += 1;
					}


				}



				//Render BookSummary.ejs from /Views/Andy/BookSummary
				res.render('Austin/BookSummary', {BookInfo: item, oneLineContent: oneLineContent, id: id, lineAmount: lineAmount});
			}
		});
	});



	//Display form to create book summary
	app.get('/Austin/getBookForm', (req, res) => {


		var collection = db.collection("AustinBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('Austin/createBookSummary');
			}
		});
	});


	//Create book summary
	app.post('/Austin/createBookSummary', (req,res) => {

		const note = {  title: req.body.title, content: req.body.content + "zz" };
		db.collection('AustinBookSummaries').insert(note, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.redirect('/Austin/getListOfBooks');
			}
		});
	});




	//Display form to append to book summary
	app.get('/Austin/getAppendForm/:id', (req, res) => {
		const id = req.params.id;
		var collection = db.collection("AustinBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('Austin/appendBookSummary', {BookInfo: result, id : id});
			}
		});
	});






	//Update book summary based on id
	app.put('/Austin/appendContent/:id', (req, res) => {
		const id = req.params.id;
		//const note = {content: res.content + " " +  req.body.content,title: res.title };






		//Convert id from URL to object ID
		const details = {'_id': new ObjectID(id)};


		const note = {  title: currentTitle , content: currentContent + req.body.content + "zz"};
		db.collection('AustinBookSummaries').update(details, note, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.redirect('/Austin/getBookSummary/' + id);
				//res.redirect('/');
			}
		});
	});









};
