
var ObjectID = require('mongodb').ObjectID

module.exports = function(app, db) {

	var currentContent = "";
	var currentTitle = "";


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
	app.get('/Andy/getBookSummary/:id', (req, res) => {
		//Get id from URL 
		const id = req.params.id;

		//Convert id from URL to object ID 
		const details = {'_id': new ObjectID(id)};

		//Find info about book summary based on the object id
		db.collection('AndyBookSummaries').findOne(details, (err, item) => {
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
					//oneLineContent.push(tempLine);
					//console.log('78');
					//console.log(oneLineContent);


				console.log("oneLineContent");
				console.log(oneLineContent);

				//Render BookSummary.ejs from /Views/Andy/BookSummary
				res.render('Andy/BookSummary', {BookInfo: item, oneLineContent: oneLineContent, id: id, lineAmount: lineAmount});
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
	app.get('/getAppendForm/:id', (req, res) => {
		const id = req.params.id;
		var collection = db.collection("AndyBookSummaries");


		collection.find({}).toArray(function (err, result) {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.render('Andy/appendBookSummary', {BookInfo: result, id : id});
			}
		});
	});
	

	//Update book summary based on id
	app.put('/appendContent/:id', (req, res) => {
		const id = req.params.id;
		//const note = {content: res.content + " " +  req.body.content,title: res.title };






		//Convert id from URL to object ID 
		const details = {'_id': new ObjectID(id)};


		const note = {  title: currentTitle , content: currentContent + req.body.content + "zz"};
		db.collection('AndyBookSummaries').update(details, note, (err, item) => {
			if(err) {
				res.send({ 'error': ' An error has occurred'});
			} else {

				res.redirect('/Andy/getBookSummary/' + id);
				//res.redirect('/');
			}
		});
	});






	



	

};