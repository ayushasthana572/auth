const express = require('express');
const fs = require('fs');
var session = require("express-session");

const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res)=>{
    if(!req.session.isLoggedIn){
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname+'/public/home.html');
});

app.get('/about',(req,res)=>{
    if(!req.session.isLoggedIn){
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname+'/public/about.html');
});

app.get('/contact',(req,res)=>{
    if(!req.session.isLoggedIn){
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname+'/public/contact.html');
});

app.get('/login',(req,res)=>{
    res.sendFile(__dirname+"/public/auth.html");
});

app.post('/login',(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    let flag = 0;
    let name;
    fs.promises
        .readFile("./userData.txt","utf-8")
        .then((data)=>{
            data=JSON.parse(data);
            data.forEach(element => {

            if(email == element.emailId && password == element.password){
                 name= element.name;
                flag =1;
            }
        })
        return;
}).then(()=>{
    if(flag==1){
        req.session.isLoggedIn = true;
        req.session.name = name;
        req.session.email = email;
        res.redirect('/');
        return;
}
    else{

        res.status(404).send(`<h1>Email or password is incorrect!!!</h1>`);
}   
    })

})

app.post('/signup',(req,res)=>{

    const userData ={
        name: req.body.nameField,
        emailId :req.body.emailId,
        password : req.body.pass
    }

    saveUserData(userData,(err)=>{
        if(err){
            res.status(400).send(`<h1>User already exist with given email</h1>`);
            return;
        }
        res.redirect('/login');
    })
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log("Error logging out: ",err);
        }
        res.status(200);
    })
})

app.get('/getUser',(req,res)=>{
    res.status(200).json(req.session.name);
})

app.listen(4001,()=>{
    console.log('Server is running at 4001...');
});

function getUserData(callback){
    fs.readFile("./userData.txt", "utf-8", (err,data)=>{
        if(err){
            callback(err);
            return;
        }

        if(data.length === 0){
            data="[]";
        }
        try{
            data = JSON.parse(data);
            callback(null,data);
        }catch(err){
            callback(err);
        }
    });
}

function saveUserData(userData,callback){
    let flag=true;
    fs.promises
        .readFile("./userData.txt","utf-8")
        .then((data)=>{
            data=JSON.parse(data);
            data.forEach(element => {

            if(userData.emailId == element.emailId){
                flag = false;
            }
        })
        if(flag){
            return data;
        }
        else{
            reject("USER Already Exists");
        }
}).then((data)=>{
    data.push(userData);
    fs.writeFile("./userData.txt",JSON.stringify(data),(err)=>{
        if(err){
            callback(err);
        }
        callback(null);
    });
}).catch((err)=>{
    callback(err);

})
    // getUserData((err,data)=>{
    //     if(err){
    //         callback(err);
    //         return;
    //     }

    //     data.push(userData);

    //     fs.writeFile("./userData.txt",JSON.stringify(data),(err)=>{
    //         if(err){
    //             callback(err);
    //             return;
    //         }

    //         callback(null);
    //     });
    // });
}