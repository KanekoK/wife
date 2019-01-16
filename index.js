const http = require('http');
const https = require('https');

function niceDay() {
  console.log('いってらっしゃい！');

  return new Promise((resolve, reject) => {
    let place = '江東区';
    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(place) + '&lang=ja&APPID=eb27703a10fddcb4d47d82eaaebf5cbe';
    
    console.log('request:' + url);
    //httpのリクエストを送信
    let req = http.get(url, (res) => {
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
        console.log(place + 'の天気は' + description + 'です！');
    
        if (description.match(/雨/) || description.match(/雪/)) {
        console.log('傘を忘れないでね！');
        } else {
        console.log('今日は傘はいらないよ！');
        }

        //処理終了
        resolve();
    });

    });
    //エラー時の処理
    req.on('error', (e) => {
      console.error(`エラー： ${e.message}`);
    });
  });
}

function densha() {
  return new Promise((resolve, reject) => {
    let url = 'https://rti-giken.jp/fhc/api/train_tetsudo/delay.json';
    
    console.log('request:' + url);
    //httpsのリクエストを送信
    let req = https.get(url, (res) => {
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

        delay_bool = (function (response) {
          let result = false;
          response.forEach(function(val, i) {
            if (val['name'] == "ニューシャトル") {
              result = true;
            }
          });
          return result;
        }(response));

        if (delay_bool) {
          console.log("電車の遅延があるので、ご注意ください！");
        } else {
          console.log("電車の遅延はありません！");
        }



        //処理終了
        resolve();
    });

    });
    //エラー時の処理
    req.on('error', (e) => {
      console.error(`エラー： ${e.message}`);
    });
  });
}

densha();