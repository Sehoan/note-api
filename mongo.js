const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('not enough arguments');
    process.exit(1)
}

const password = process.argv[2];

const url = 
    `mongodb+srv://swan:${password}@cluster0.8yytm.mongodb.net/noteDB?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify: false, useCreateIndex: true });

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note);
    });
    mongoose.connection.close();
})
