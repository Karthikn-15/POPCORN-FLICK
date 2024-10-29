import {useEffect, useState} from "react";
import StarRating from "./StarRating";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "d6de8a34";
export default function App() {
  const tempQuery = "Ayan ";
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, SetQuery] = useState("Interstellar");
  const [error, setError] = useState("");
  const [selectedID, SetSelectedId] = useState(null);
  const [IsLoading, setIsloading] = useState(false);

  function handleAddWatchList(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  function handleSelectedId(id) {
    SetSelectedId((selectedID) => (id === selectedID ? null : id));
  }
  function handleUnSelectId() {
    SetSelectedId(null);
  }
  // useEffect(function () {
  //   console.log("A");
  // }, []);
  // useEffect(function () {
  //   console.log("B");
  // });
  // console.log("C");
  useEffect(
    function () {
      async function FetchMovies() {
        try {
          setIsloading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          console.log(query);
          if (!res.ok) throw new Error("Something Went Wrong :(");
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie is Not Found");
          setMovies(data.Search);
          console.log(data.Search);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setIsloading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      FetchMovies();
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar movie={tempQuery} query={query} setQuery={SetQuery} />
        <Results movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {IsLoading && <Loader />}
          {
            /* {IsLoading ? <Loader /> : <ListOF movies={movies} />} */
            !IsLoading && !error && (
              <ListOF movies={movies} onSelectMovie={handleSelectedId} />
            )
          }
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedID ? (
            <SelectedMovie
              selectedID={selectedID}
              onUnSelect={handleUnSelectId}
              AddWatch={handleAddWatchList}
            />
          ) : (
            <>
              <WatchedMovies watched={watched} />
              <WatchedInpast watched={watched} onDelete={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({message}) {
  return (
    <p className="error">
      <span>🤷🏾‍♂️</span>
      {message}
    </p>
  );
}
function Main({children}) {
  return <main className="main">{children}</main>;
}
function NavBar({children}) {
  return <nav className="nav-bar">{children}</nav>;
}
function Results({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>Karthikn Talkies!</h1>
    </div>
  );
}
function SearchBar({setQuery, query}) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function Box({children}) {
  const [isOpen, setIsOpen] = useState(true);
  function Button() {
    return (
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
    );
  }
  return (
    <div className="box">
      <Button />
      {isOpen && children}
    </div>
  );
}
/*function WatchedList() {
  const [isOpen2, setIsOpen2] = useState(true);
  function Button() {
    return (
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}>
        {isOpen2 ? "–" : "+"}
      </button>
    );
  }
  return (
    <div className="box">
      <Button />
      {isOpen2 && (
        
      )}
    </div>
  );
}*/
function ListOF({movies, onSelectMovie}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movies
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}

function Movies({movie, onSelectMovie}) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function SelectedMovie({selectedID, onUnSelect, AddWatch}) {
  const [movie, setMovies] = useState({});
  const [userRating, setUserRating] = useState();
  const [IsLoading, setIsloading] = useState(false);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Actors: actors,
    Genre: genre,
    Director: director,
  } = movie;

  function HandleAddMovies({selectedID}) {
    const WatchedMovie = {
      imdbID: selectedID,
      poster,
      title,
      imdbRating: Number(imdbRating),
      runtime: runtime.split().at(0),
      year,
    };
    console.log(WatchedMovie);
    AddWatch(WatchedMovie);
  }

  useEffect(
    function () {
      async function GetMoviesDetails() {
        setIsloading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );
        const data = await res.json();
        setMovies(data);
        setIsloading(false);
      }
      GetMoviesDetails();
    },
    [selectedID]
  );

  return (
    <div className="details">
      {IsLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onUnSelect}>
              &larr;
            </button>
            <img src={poster} alt={`poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released}&bull; {`Duration ${runtime}s`}
              </p>
              <p>{genre}</p>
              <p>{actors}</p>
              <p>
                <span>⭐️</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                color="gold"
                size={28}
                onSetRating={setUserRating}
              />
              <button className="btn-add" onClick={HandleAddMovies}>
                Add To Watched List
              </button>
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring : {actors}</p>
            <p>{`Directed by ${director}`}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedMovies({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime}</span>
        </p>
      </div>
    </div>
  );
}
function WatchedInpast({watched, onDelete}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedM movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}
function WatchedM({movie, onDelete}) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} </span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
