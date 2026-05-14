import express from 'express'
import cors from 'cors'
const app=express();
let arr=[];
let stock1=0;
let stock2=0;
app.use(cors())

app.get('/post', (req, res) => {
    if (req.query.a == undefined || req.query.a == '' || req.query.a == null || req.query.a == ' ') {
        res.send('No data received');
        return;
    }
    arr.push(req.query.a);
    res.send(req.query.a);
})
app.get('/post2', (req,res)=>{
     if (req.query.a == undefined) {
        res.send('No data received');
        return;
    }
    stock1=req.query.a;
    stock2=req.query.b;
    // console.log(stock1);
    res.send(req.query.a);
})

app.get('/data', (req, res) => {
    res.send(arr);
})
app.get('/data2', (req, res) => {
    res.send(stock1);
})
app.get('/data3', (req, res) => {
    res.send(stock2);
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})