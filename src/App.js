// import logo from "./logo.svg";
import axios from "axios";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import "./App.css";
import { CircularProgress } from "@mui/material";

function App() {
  axios.get("");
  const [movies, setMovies] = useState([]);
  const [base64String, setBase64String] = useState("");
  const [loading,setLoading] = useState(false);

  const Movielist = () => {
    if (movies.length > 0) {
      return (
        <div className="movielist">
          {movies.map((mov, index) => {
            return (
              // <a href={mov.url}  key={index}>
              <div className="Movie">
                <img
                  className="MovieImage"
                  src={`data:image/jpeg;base64,${mov.img}`}
                  alt={mov.title}
                />
                <div classname="text">
                  <div className="title">{mov.title}</div>
                  <div className="qualities">
                    {mov.quality.map((qua, ind) => {
                      return (
                        <a href={qua.url} key={ind}>
                          <Chip
                            label={`${qua.quality} (${qua.size})`}
                            // variant="outlined"
                            color="primary"
                            clickable
                          />
                          {/* <Tooltip arrow>
                          <Button>
                            
                          </Button>
                        </Tooltip> */}
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
              // </a>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    var moviename = "";
    setMovies([]);
    setLoading(true);
    if (e.target.moviename !== undefined) {
      moviename = e.target.moviename.value;
    } else if (e.target.value !== undefined) {
      moviename = e.target.value;
    }
    // console.log(e.target.value);
    await axios
      .get(
        `https://free-movie-extension.vercel.app/api?moviename=${moviename}`
      )
      // .get(`http://127.0.0.1:4000/api?moviename=${moviename}`)
      .then((response) => {
        console.log(response.data);
        setMovies(response.data);
        setLoading(false);
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
            // onChangeCapture={async (e) => {
            //   // e.preventDefault();
            //   // setName(e.target.value);
            //   await handleSubmit(e);
            //   // console.log(e.target.value);
            // }}
            // value={name}
            className="Search-box"
            name="moviename"
            id="filled-basic"
            label="Search Movie"
            variant="filled"
          />
        </form>
        <div className="Movies">
          {loading === true ? (
            <CircularProgress />
          ) : (
            <Movielist />
          )}
          {/* <Movielist /> */}
        </div>
      </header>
    </div>
  );
}

export default App;
