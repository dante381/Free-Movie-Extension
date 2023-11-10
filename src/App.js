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
    axios
      .post("http://anishkprod.ddns.net:81/api/", {
        moviename: moviename,
      })
      .then((response) => {
        console.log(response.data);
        setMovies(response.data);
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
