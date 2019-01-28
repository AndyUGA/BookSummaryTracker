
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {



	//Delete Note based on id
	app.delete('/notes/delete/:id', (req, res) => {
		const id = req.params.id;


		const details = {'_id': ObjectID(id) };

		db.collection('notes').remove(details, (err, item) => {
			if(err) {
				console.log("Error is " + err);
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.send('Note ' + id + ' has been deleted!');
			}
		});
	});


	

	//Display page to add note to database
	app.get('/addNote', (req, res) => {
	
		var collection = db.collection("notes");
		var currentNotes = [];

		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('addNote');
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

	//Create note
	app.post('/note/create', (req,res) => {

		const note = {  title: req.body.title, content: req.body.content };
		db.collection('notes').insert(note, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.redirect('/');
			}
		});
	});



	//Get Note based on id
	app.get('/notes/:id', (req, res) => {
		const id = req.params.id;


		const details = {'_id': new ObjectID(id) };
		db.collection('notes').findOne(details, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {
				res.send("Note is " + item.contents);
			}
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






	//Create workshop
	app.post('/register/workshop', (req,res) => {

		const note = {  participantName: req.body.participantName,workShopName: req.body.workShopName };
		db.collection('notes').insert(note, (err, result) => {
			if(err) {
				res.send({'error': 'An error has occurred'});
			} else {
				res.redirect('/registration/all');
			}
		});

	});


	



	

};