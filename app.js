const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const request = require('request').defaults({ jar: true });
const cookieParser = require('cookie-parser');
const fs = require('fs');


const urlencodedParser = bodyParser.urlencoded({ extended: true });

// Item Submit Post Route

const uploadFile = () => {
    let options = {
        url: 'http://10.14.4.5/pictures/upload.php',
        headers: {
            'MAX_FILE_SIZE': '10485760',
            'Content-Type': 'multipart/form-data',
        },
        formData: {
            'title': 'RainyDay.php',
            'tag': 'RainyDay.php',
            'price': '1000',
            'pic': fs.createReadStream('./RainyDay.jpg'),
            'name': 'RainyDay.php',
        }
    };
    return new Promise((resolve, reject) => {
        request.post(options, (error, res, body) => {
            if (!error && res.statusCode == 303) {
                resolve(res);
            } else {
                reject(error);
            }
        });
    })
}

const login = (cookie) => {
    let cookieString = 'PHPSESSID='.concat(cookie.PHPSESSID);
    console.log('Cookie String:'.concat(cookieString));
    const j = request.jar();
    let cookieParam = request.cookie(cookieString);
    j.setCookie(cookieParam, 'http://10.14.4.5');
    let options = {
        url: 'http://10.14.4.5/pictures/upload.php',
        jar: j,
        headers:
        {
            'Content-Type': 'multipart/form-data',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101, Firefox/60.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'MAX_FILE_SIZE': '10485760',
        },
        formData: {
            'title': 'RainyDay.php',
            'tag': 'RainyDay.php',
            'price': '1000',
            'pic': fs.createReadStream('./RainyDay.jpg'),
            'name': 'RainyDay.php',
        }
    };
    return new Promise((resolve, reject) => {
        request.post(options, (error, res, body) => {
            if (error) { //&& res.statusCode == 303) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    })
}
server.post('/', urlencodedParser, (req, res) => {
    // console.log(req.body['PHPSESSID']);
    let loginRes = login(req.body).then((resp) => {

        console.log(resp.body)
    });
    // return;
});

server.listen(8222, ()=> {
    console.log('listening for requests ..')
});
