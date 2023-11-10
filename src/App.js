import logo from "./logo.svg";
import axios from "axios";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import "./App.css";

function App() {
  axios.get("");
  const [movies, setMovies] = useState([]);
  const [name,setName] = useState('');

  const Movielist = () => {
    if (movies.length > 0) {
      return (
        <div className="movielist">
          {movies.map((mov, index) => {
            return (
              <a href={mov.url}  key={index}>
                <div className="Movie">
                  <img
                    className="MovieImage"
                    src={mov.img}
                    alt={mov.title}
                  />
                  <div className="title">{mov.title}</div>
                </div>
              </a>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="emptylist">
          To Download a movie Double-Click the title or
          Ctrl+Click.
        </div>
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var moviename="";
    if(e.target.moviename!==undefined){
      moviename=e.target.moviename.value;
    }
    else if(e.target.value!==undefined){
      moviename=e.target.value;
    }
    // console.log(e.target.value);
    // axios
    //   .post("http://anishkprod.ddns.net:81/api/", {
    //     moviename: moviename,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //     setMovies(response.data);
    //   });
    axios
    .get(
      `https://yts.mx/api/v2/list_movies.json?query_term=${moviename}&limit=50`,
      // {
      //   headers: {
      //     "User-Agent":
      //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
      //     Host: "yts.mx",
      //     Connection: "keep-alive",
      //     "Accept-Encoding": "gzip, deflate, br",
      //     // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      //     //   'Referer':`https://1337x.st/search/jawan/1/`
      //   },
      // }
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
      setMovies(result);
    })
    .catch((err) => {
      console.log("ERROR");
      // axios
      //   .post("http://anishkprod.ddns.net:81/api", {
      //     moviename: req.body.moviename,
      //   })
      //   .then((result) => {
      //     res.send(result.data);
      //   });
    });
  };
  console.log(movies);
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit} className="form">

        <TextField
          // onSubmit={(e)=>{
          //   console.log("ENTER");
          //   handleSubmit(e);
          // }}
          onChangeCapture={(e) => {
            // e.preventDefault();
            // setName(e.target.value);
            handleSubmit(e);
            // console.log(e.target.value);
          }}
          // value={name}
          className="Search-box"
          name="moviename"
          id="filled-basic"
          label="Search Movie"
          variant="filled"
        />
        </form>
        <div className="Movies">
          <Movielist />
        </div>
      </header>
    </div>
  );
}

export default App;
