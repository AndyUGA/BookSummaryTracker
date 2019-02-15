
var ObjectID = require('mongodb').ObjectID
const MongoClient = require('../../node_modules/mongodb').MongoClient;
const db = require('../../config/db');


module.exports = function(app, db) {

	var currentContent = "";
	var currentTitle = "";


	//Display home page
	app.get('/', (req, res) => {


		//Renders index.ejs in vikews directory
		res.redirect('/Andy/getListOfBooks');
	});


	//Display list of books being read by user (ListOfBooks.ejs)
	app.get('/Andy/getListOfBooks', (req, res) => {



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

		res.render('Andy/createBookEntry');

	});

	//Display form to append to book summary
	app.get('/Andy/getAppendForm/:id/:name', (req, res) => {
		const id = req.params.id;
		const name = req.params.name;
		var collection = db.collection('name');


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				console.log('75 Result is ');
				console.log(result);
				res.render('Andy/updateBookNote', {BookInfo: result, id : id, name: name});
			}
		});
	});

	//Display form to create new note for book entry
	app.get('/Andy/createNoteForm/:name', (req, res) => {

		const name = req.params.name;
		var collection = db.collection('name');


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('Andy/createNote', {BookInfo: result, name: name});
			}
		});
	});




	//Delete Book Entry
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
	app.post('/Andy/createBookEntry', (req,res) => {

		MongoClient.connect("mongodb://andy:test123@ds129085.mlab.com:29085/bookentries", function(err, db) {
			if (err) throw err;
			var dbo = db.db("bookentries");
			dbo.createCollection(req.body.title, function(err, res) {
				if (err) throw err;
				console.log("Collection created!");
				db.close();

			});
			res.redirect('/Andy/getListOfBooks');
		});
});



	//Create new note for book entry
	app.post('/Andy/createNote/:name', (req, res) => {
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



	//Update book summary based on id
	app.put('/Andy/:id/:name/updateNotes/', (req, res) => {
		const id = req.params.id;
		const name = req.params.name;
		//const note = {content: res.content + " " +  req.body.content,title: res.title };

		const note = {  content: req.body.content };
		const details = {'_id': new ObjectID(id) };



		db.collection('name').update(details, note, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				//res.redirect('/Andy/' + name + '/getNotes');
				res.redirect('/');
			}
		});
	});












};
