
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {





	

	//Display page to add book summary to database
	app.get('/getAndyBookSummaries', (req, res) => {
	
		var collection = db.collection("AndyBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('AndyCurrentBooks', {result: result});
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

				res.render('appendBookSummary', {id : id});
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






	//Displays all notes in database
	app.get('/notes', (req, res) => {

		var collection = db.collection("notes");
		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.send(result);

			}
		});
	});

	//Displays home page
	app.get('/', (req, res) => {
	
		var collection = db.collection("notes");
		var currentNotes = [];
		var notesID = [];




		collection.find({}).toArray(function (err, result) {


			for(var i = 0; i < result.length; i++)
			{


				notesID.push(ObjectID(result[i]._id));
			}

			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('index', {currentNotes: result, notesID: notesID});
			}
			console.log('notesID is ' + notesID);

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
		const note = {content: res.content + req.body.content,title: req.body.title };
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