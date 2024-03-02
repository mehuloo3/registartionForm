const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");


const app=express();
dotenv.config();

const port=process.env.PORT || 3000;
const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.dzrr10u.mongodb.net/registrationSchemaDb`,{

});
app.use(express.static(__dirname + '/'));
const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const Registration=new mongoose.model("registration",registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>
{
 res.sendFile(__dirname + "index.html");
});

app.post("/",async(req,res)=>
{
 try{
    const {name,email,password}=req.body;
    const existingUser = await Registration.findOne({ email: email });
    if(!existingUser)
    {
        const registrationData=new Registration(
            {
        name:name,
        email:email,
        password:password
            });   
            await registrationData.save();
            res.redirect("/complete");
    }
    else
    {
        console.log("user already exist!!");
        res.redirect("/error");
         
    }
 }
 catch(error){
    console.error(error);
   res.status(500).send("server error");}
});
app.get("/complete",(req,res)=>
{
res.sendFile(__dirname+"complete.html");
});

app.get("/error",(req,res)=>
{
res.sendFile(__dirname+"error.html");
});

app.listen(port,()=>
{
console.log(`the server is live ${port} `);
});
