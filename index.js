const http = require('http');
const https = require('https');

const route = "大江戸線";
const place = '江東区';
let reply = "";

function niceDay() {

  return new Promise((resolve, reject) => {
    let weather_url = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(place) + '&lang=ja&APPID=eb27703a10fddcb4d47d82eaaebf5cbe';
    let train_url = 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json';

    //httpのリクエストを送信
    let req = http.get(weather_url, (res) => {
      let chunk = '';
      //読み込み中の処理
      res.on('data', (c) => {
        chunk += c;
      });

      //読み込み完了時の処理
      res.on('end', () => {
        let response = JSON.parse(chunk);
        console.log('response: ' + JSON.stringify(response));
          
        //パラメータの取得
        let weather = response['weather'][0];
        let description = weather['description'];
          
        //表示
        reply = 'いってらっしゃい！';
        reply += place + 'の天気は' + description + 'です！';
      
        if (description.match(/雨/) || description.match(/雪/)) {
          reply += '傘を忘れないでね！';
        } else {
          reply += '今日は傘はいらないよ！';
        }
      });
    });

    //httpsのリクエストを送信
    req = https.get(train_url, (res) => {
      let chunk = '';
      //読み込み中の処理
      res.on('data', (c) => {
          chunk += c;
      });

      //読み込み完了時の処理
      res.on('end', () => {
        let response = JSON.parse(chunk);
        
        //パラメータの取得
        // console.log(response);

        let delay_bool = (function (response) {
          let result = false;
          response.forEach(function(val, i) {
            if (val['name'] == route) {
              result = true;
            }
          });
          return result;
        }(response));
        console.log("delay_bool: " + delay_bool);

        if (delay_bool) {
          reply += "電車の遅延があるので、ご注意ください！";
        } else {
          reply += "電車の遅延はありません！";
        }
        console.log(reply);

      //エラー時の処理
        req.on('error', (e) => {
          console.error(`エラー： ${e.message}`);
        });
      });
    });
  });
}

niceDay();