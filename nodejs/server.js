

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require('node-fetch');
const frameguard = require('frameguard')
const mongoose = require('mongoose')

require('dotenv').config();

const app = express();

const db = mongoose.connection;

app.use(frameguard({ action: 'SAMEORIGIN' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/youtubeAPI/save", (req, res) => {
   	mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
   	
  	db.collection("user_activity").insertOne(req.body, function(err, res) {
    if (err) throw err;
    db.close();
  });
    res.json('data received');

})

app.post("/youtubeAPI", (req, res) => {

	let count = req.body.count;
	let keyword = req.body.keyword;
	let fetchApi = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${keyword}&maxResults=${count}&order=viewCount&key=${process.env.GOOGLE_API_KEY}`;
   	if (req.body.keyword.length < 20){
   	fetch(fetchApi)
	.then(res => res.json())
	.then(data => res.send(data.items))
	} 
	else if (req.body.keyword.length >= 20){
		res.status(400)
		res.json('Input request too long.');
	}
	else if (count == null || keyword == null) {
		res.status(400)
		res.json('Invalid request.');
	}
	else if (!count.isInteger()) {
		res.status(400)
		res.json('Invalid count.');
	}

})


app.use((err, req, res, next) => {
  res.status(422).send({ error: err._message });
});


app.listen(8080, () => console.log('Express Server running on port 8080'));