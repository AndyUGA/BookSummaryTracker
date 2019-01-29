
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {


	//Display home page
	app.get('/', (req, res) => {

		//Renders index.ejs in views directory
		res.render('index');
	});


	

	//Display page to add book summary to database
	app.get('/Andy/ListOfBooks', (req, res) => {
	
		//Get information from mLab database 
		var collection = db.collection("AndyBookSummaries");

		//Returns all info in mLab database into JSON format
		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				//Render 
				res.render('Andy/ListOfBooks', {result: result});
			}
		});
	});

	//Display form to create book summary
	app.get('/AndyBookSummariesForm/:id', (req, res) => {
		

		var collection = db.collection("AndyBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('createBookSummary');
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




	//Create book summary 
	app.post('/AndyBookSummaries/create', (req,res) => {

		const note = {  title: req.body.title, content: req.body.content };
		db.collection('AndyBookSummaries').insert(note, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.redirect('/');
			}
		});
	});




	


	//Get Note based on id
	app.get('/AndyBookSummaries/content/:id', (req, res) => {
		const id = req.params.id;


		const details = {'_id': new ObjectID(id) };
		db.collection('AndyBookSummaries').findOne(details, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.render('AndyBookSummary', {BookInfo: item, id: id});
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