
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {





	

	//Display page to add book summary to database
	app.get('/getAndyBookSummaries', (req, res) => {
	
		var collection = db.collection("AndyBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('AndyBookSummaries', {result: result});
			}
		});
	});

	//Display form to add book summary
	app.get('/AndyBookSummariesForm', (req, res) => {
	
		var collection = db.collection("AndyBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('AndyAddBookSummaries');
			}
		});
	});




	//Create book summary 
	app.post('/AndyBookSummaries/create', (req,res) => {

		const note = {  title: req.body.title, content: req.body.content };
		db.collection('notes').insert(note, (err, result) => {
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

	




	

	//Update existing note based on id
	app.put('/notes/:id', (req, res) => {
		const id = req.params.id;
		const note = {  contents: req.body.contents,title: req.body.title };

		const details = {'_id': new ObjectID(id) };
		db.collection('notes').update(details, note, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.send(item);
			}
		});
	});






	



	

};