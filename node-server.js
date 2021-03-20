const http = require('http');
const fs = require('fs');

let current_user = '';

const app = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    if(req.url === '/' && req.method === 'GET'){
        fs.readFile("./registration.html", "utf8", (err, data) => {
            res.end(data);
        })
    }
    else if (req.url === '/registration' && req.method === 'POST'){
        let body = '';
        req.on('data', (data) =>{
            body += data;
        })
        req.on('end', () => {
            fs.readFile('registration.json', 'utf8', (err,data)=>{
                let json = JSON.parse(data);
                let real_info = JSON.parse(body);
                json[real_info.username] = real_info;
                json = JSON.stringify(json);
                fs.writeFile('./registration.json', json, err =>{
                    if(err){
                        res.end(JSON.stringify({status: 1}))
                    }
                    res.end(JSON.stringify({status: 0}))
                })
            })
        })
    }
    else if (req.url === '/login' && req.method === 'GET'){
        fs.readFile("./login.html", "utf8", (err, data) => {
            res.end(data);   
        })
    }
    else if (req.url === '/login' && req.method === 'POST'){
        let login_body = '';
        req.on('data', (data) =>{
            login_body += data;
        })
        req.on('end', () =>{
            fs.readFile('registration.json', 'utf8', (err, data)=>{
                let json_data = JSON.parse(data);
                let login_json = JSON.parse(login_body)
                let userkey = login_json.username;
                current_user = userkey;
                if(current_user){
                   if(json_data[current_user].password === login_json.password){
                       res.end(JSON.stringify({status: 0, msg: "You've successfully login"}))
                   }
                   else{
                       res.end(JSON.stringify({status: 2, msg:"Incorrect Password"}))
                   }
                }
                else{
                   res.end(JSON.stringify({status: 1, msg: "Username Not Found"}))
                }
            })
        })
    }
    else if (req.url === '/profile' && req.method === 'GET'){
        fs.readFile("./profile.html", "utf8", (err, data) => {
            res.end(data);   
        })
    }
    else if (req.url === '/profile-info' && req.method === 'GET'){
        fs.readFile("./registration.json", "utf8", (err, data) => {
            let json_data = JSON.parse(data)
            if(json_data[current_user]){
                delete json_data[current_user].password;
                res.end(JSON.stringify({status: 0, msg: "student info", data: json_data[current_user]}))
            }

        })
    }
})

app.listen(3002, () =>{
    console.log('app is running on port 3002')
})