const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const pretty = require("pretty");
const morgan = require("morgan");
const fs = require("fs");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined"));
app.use(express.static('./public'));

app.get("");

app.get("/api", async (req, res) => {
  // console.log(req.body.moviename);
  var moviename = req.query.moviename;

  await axios
    .get(
      `https://yts.mx/api/v2/list_movies.json?query_term=${moviename}&limit=25`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
          Host: "yts.mx",
          Connection: "keep-alive",
          "Accept-Encoding": "gzip, deflate, br",
          // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          //   'Referer':`https://1337x.st/search/jawan/1/`
        },
      }
    )
    .then(async (response) => {
      //   const site= cheerio.load(response.data);
      //   console.log(pretty(site.html()));
      // console.log(response.data);
      var result = [];
      var data = response.data;
      // console.log(data);
      if (data.status === "ok") {
        // console.log(data.data);
        for (var movie in data.data.movies) {
          console.log(data.data.movies.length);
          var buffer;
          // if(!fs.existsSync(`./public/images/${data.data.movies[movie].title_english}.jpg`)){
            while(true){
              try{
                await axios.get(data.data.movies[movie].large_cover_image,
                  { responseType: 'arraybuffer' },
                  {
                    headers: {
                      "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/12",
                      Host: "yts.mx",
                      Connection: "keep-alive",
                      "Accept-Encoding": "gzip, deflate, br",
                      // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q",
                      // "Cookie": "eplod=1"
                      //   'Referer':`https://1337x.st/search/jawan/1/`
                    },
                  }
                )
                // eslint-disable-next-line no-loop-func
                .then((res) => {
                  // console.log(res.data);
                  // console.log(movie);
                  // console.log(data.data.movies[movie].title_english);
                  buffer=res.data.toString("base64");
                  // console.log(buffer);
                  // const fileName = data.data.movies[movie].title_english.replace(/[/\-:.*+?^${}()|[\]]/g, '');
                  // fs.writeFile(`./public/images/${fileName}.jpg`, res.data, (err) => {
                  //   if (err) throw err;
                  //   console.log('Image downloaded successfully!');
                  // });
                })
                // .catch((err)=>{
                //   console.log(err);
                // });
                break;
              }
              catch(err){
                console.log("image err");
              }
            }
          // }

          result.push({
            title: data.data.movies[movie].title_english,
            quality:[],
            img: buffer,
          });

          for(var torrent in data.data.movies[movie].torrents){
            result[movie].quality.push({url:`magnet:?xt=urn:btih:${
              data.data.movies[movie].torrents[torrent].hash
            }&dn=${
              data.data.movies[movie].title_english
            }&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969`,
          quality:data.data.movies[movie].torrents[torrent].quality,
          size:data.data.movies[movie].torrents[torrent].size
          })
          }
        }
      }
      // console.log(result);
      res.send(result);
    })
    .catch(async (err) => {
      console.log("movie list error");
      console.log(err);
      await axios
        .get(`https://free-movie-extension.vercel.app/api?moviename=${moviename}`)
        // .get(`http://127.0.0.1:4000/api?moviename=${moviename}`)
        .then((result) => {
          res.send(result.data);
        });
    });

  //   res.end();
});

app.listen(port, "0.0.0.0", () => {
  console.log("Server started");
});

module.exports = app;