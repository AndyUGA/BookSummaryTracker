
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {


	//Display home page
	app.get('/', (req, res) => {

		//Renders index.ejs in views directory
		res.render('index');
	});


	

	//Display list of books being read by user (ListOfBooks.ejs)
	app.get('/Andy/getListOfBooks', (req, res) => {
	
		//Get information from mLab database 
		var collection = db.collection("AndyBookSummaries");

		//Returns all info in mLab database into JSON format
		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				//Render ListOfBooks.ejs in views directory
				res.render('Andy/ListOfBooks', {result: result});
			}
		});
	});

	//Get Book summary information based on id
	app.get('/getBookSummary/content/:id', (req, res) => {
		//Get id from URL 
		const id = req.params.id;

		//Convert id from URL to object ID 
		const details = {'_id': new ObjectID(id)};

		//Find info about book summary based on the object id
		db.collection('AndyBookSummaries').findOne(details, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				//Render BookSummary.ejs from /Views/Andy/BookSummary
				res.render('Andy/BookSummary', {BookInfo: item, id: id});
			}
		});
	});



	//Display form to create book summary
	app.get('/Andy/getBookForm', (req, res) => {
		

		var collection = db.collection("AndyBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('Andy/createBookSummary');
			}
		});
	});


	//Create book summary 
	app.post('/Andy/createBookSummary', (req,res) => {

		const note = {  title: req.body.title, content: req.body.content };
		db.collection('AndyBookSummaries').insert(note, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.redirect('/Andy/ListOfBooks');
			}
		});
	});





	//Display form to append to book summary
	app.get('/appendBookSummary/:id', (req, res) => {
		const id = req.params.id;
		var collection = db.collection("AndyBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('appendBookSummary', {BookInfo: result, id : id});
			}
		});
	});




	



	


	

	

	//Update existing note based on id
	app.put('/AndyBookSummaries/content/:id', (req, res) => {
		const id = req.params.id;
		console.log('152');
		console.log(res.content);
		const note = {content: res.content + " " +  req.body.content,title: res.title };
		//const note = {content: req.body.content,title: req.body.title };

		const details = {'_id': new ObjectID(id) };
		db.collection('AndyBookSummaries').update(details, note, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.render('index', {BookInfo: item, id: id});
			}
		});
	});






	



	

};