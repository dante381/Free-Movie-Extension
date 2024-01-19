const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const pretty = require("pretty");
const morgan = require("morgan");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("combined"));

app.get("");

app.get("/api", (req, res) => {
  // console.log(req.body.moviename);
  var moviename = req.query.moviename;
  axios
    .get(
      `https://yts.mx/api/v2/list_movies.json?query_term=${moviename}&limit=50`,
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
    .then((response) => {
      //   const site= cheerio.load(response.data);
      //   console.log(pretty(site.html()));
      // console.log(response.data);
      var result = [];
      var data = response.data;
      // console.log(data);
      if (data.status === "ok") {
        // console.log(data.data);
        for (var movie in data.data.movies) {
          // console.log(data.data.movies);
          
          result.push({
            title: data.data.movies[movie].title_english,
            url: `magnet:?xt=urn:btih:${
              data.data.movies[movie].torrents[data.data.movies[movie].torrents.length-1].hash
            }&dn=${
              data.data.movies[movie].title_english
            }&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969`,
            img: data.data.movies[movie].large_cover_image,
          });
        }
      }
      // console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log("ERROR");
      axios
        .get(`http://anishkprod.ddns.net:81/api?moviename=${moviename}`)
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