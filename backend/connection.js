const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://varshajohn2004:bMLsilQNfPkmR2yK@cluster0.qkdnxzg.mongodb.net/projectDB?retryWrites=true&w=majority&appName=Cluster0')
.then((res) => {
    console.log('Connected to MongoDB');
})
.catch((res) => {
    console.log('DB not connected');
});