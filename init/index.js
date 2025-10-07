const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../Models/listing.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/luxestay');
};

main()
.then((res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log("Error is occured");
});

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:'68d35d9550843cde0e3c3914'}));
    await Listing.insertMany(initData.data);
    console.log('Data was initialize');
};

initDB();