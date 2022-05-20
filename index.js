const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ffrgt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){

    try{
        await client.connect();
        const database = client.db('station');
        const channelCollection = database.collection('channel');

    
        app.post('/channel/add' , async(req , res)=>{
            const channel = req.body;
          const result = await channelCollection.insertOne(channel);
           res.json(result);
           
        })
    
    
         
        app.get('/channel/:email' , async(req ,res)=>{
            const email = req.params.email;
            const query = {userEmail : email}
            const cursor =channelCollection.find(query);
            const blogs = await cursor.toArray();
            res.json(blogs)

        })
      
        app.put('/channel/edit', async(req,res)=>{

            const id = req.body._id
            const stationName = req.body.name;
            const stationRegion = req.body.region;
            const servieChannel = req.body.channel;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {$set:  {name:stationName, region:stationRegion, channelNo:servieChannel}};
            const result = await channelCollection.updateOne(filter, updateDoc );
            res.json(result)
        })

        app.delete('/channel/:id' , async(req , res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const station = await channelCollection.deleteOne(query);
            console.log('deleted station ' , station)
            res.json(station);
        })
  

        
        

    
        
 

        



 

   

    }
    finally{
        // await client.close();
    }


}

run().catch(console.dir);



app.get('/', ( req , res)=>{
    res.send('assignment 12')
})

app.listen(port , ()=>{
    console.log(`listening at ${port}`)
})