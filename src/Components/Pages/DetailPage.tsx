import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";
import add from "../../Assets/Add.svg";
import greenSquare from "../../Assets/GreenSquare.svg";
import blueSquare from "../../Assets/BlueSquare.svg";
import orangeSquare from "../../Assets/OrangeSquare.svg";
import yellowSquare from "../../Assets/YellowSquare.svg";
import redSquare from "../../Assets/RedSquare.svg";
import { fetchDataFromApi } from "../../Api/api";
import Loading from "./Loading";

interface Statistics {
  completed: number;
  watching: number;
  on_hold: number;
  plan_to_watch: number;
  dropped: number;
  total: number;
}

const DetailPage = () => {
  const location = useLocation();
  const anime = location.state?.anime;
  const navigate = useNavigate();

  const [episodes, setEpisodes] = useState([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userAnimeStatus, setUserAnimeStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const eps = await fetchDataFromApi(`anime/${anime.mal_id}/episodes`);
      setEpisodes(eps.data);
      const stats = await fetchDataFromApi(`anime/${anime.mal_id}/statistics`);
      setStatistics(stats.data);

      if (auth.currentUser) {
        const animeRef = doc(
          db,
          "Users",
          auth.currentUser.uid,
          "AnimeList",
          anime.mal_id.toString()
        );
        getDoc(animeRef).then((docSnap) => {
          if (docSnap.exists()) {
            setUserAnimeStatus(docSnap.data().status);
            setShowDropdown(true);
          }
        });
      }
      setLoading(false);
    };
    fetchData();
  }, [anime]);

  const handleAddToList = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const initialStatus = "Watching";
    const animeData = {
      status: initialStatus,
      title: anime.title,
      img: anime.images.jpg.image_url,
    };

    const animeRef = doc(
      db,
      "Users",
      auth.currentUser.uid,
      "AnimeList",
      anime.mal_id.toString()
    );
    await setDoc(animeRef, animeData, { merge: true });
    setUserAnimeStatus(initialStatus);
    setShowDropdown(true);
  };

  const handleStatusChange = async (event: any) => {
    const newStatus = event.target.value;
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    const animeRef = doc(
      db,
      "Users",
      auth.currentUser.uid,
      "AnimeList",
      anime.mal_id.toString()
    );
    await setDoc(animeRef, { status: newStatus }, { merge: true });
    setUserAnimeStatus(newStatus);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="banner">
        <img src={anime?.images.jpg.large_image_url} alt={anime?.title} />
      </div>

      <div className="columnContainer">
        <div className="leftCol">
          <img src={anime?.images.jpg.image_url} alt={anime?.title} />
          <div className="dropdownContainer">
            {!showDropdown ? (
              <button className="dropdownButton" onClick={handleAddToList}>
                <p>Add To List</p>
                <img src={add} alt="Add to List" height={24} width={24} />
              </button>
            ) : (
              <select
                className="selection"
                value={userAnimeStatus}
                onChange={handleStatusChange}
              >
                <option value="Watching">Watching</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
                <option value="Plan to Watch">Plan to Watch</option>
                <option value="Dropped">Dropped</option>
              </select>
            )}
          </div>

          <div className="section">
            <div className="keyDetails">
              <div>
                <label>Score</label>
                <p>{anime?.score}</p>
              </div>
              <div>
                <label>Status</label>
                <p>
                  {anime?.status === "Currently Airing"
                    ? "Airing"
                    : anime?.status}
                </p>
              </div>
              <div>
                <label>Genres</label>
                {anime?.genres.map((genre: any) => (
                  <p key={genre.mal_id} className="genres">
                    {genre.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="middleCol">
          <div className="section">
            <div className="animeHeader">
              <label className="introH3">{anime?.title}</label>
              <p className="episodes">{episodes?.length} Episodes</p>
            </div>
            <p className="synopsis">{anime?.synopsis}</p>
          </div>

          <div className="blackSection">
            <div className="inner"></div>
            <label>Status Distribution</label>
            <div className="legendValues">
              <div className="completed">
                <div className="contentWrapper">
                  <img src={greenSquare} height={35} width={35} />
                  <div className="legendContent">
                    <p>Completed</p>
                    <div>
                      <p className="completedText">{statistics?.completed}</p>
                      <p className="userText">Entries</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="watching">
                <div className="contentWrapper">
                  <img src={blueSquare} height={35} width={35} />
                  <div className="legendContent">
                    <p>Watching</p>
                    <div>
                      <p className="watchingText">{statistics?.watching}</p>
                      <p className="userText">Entries</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="paused">
                <div className="contentWrapper">
                  <img src={orangeSquare} height={35} width={35} />
                  <div className="legendContent">
                    <p>Paused</p>
                    <div>
                      <p className="pausedText">{statistics?.on_hold}</p>
                      <p className="userText">Entries</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="planned">
                <div className="contentWrapper">
                  <img src={yellowSquare} height={35} width={35} />
                  <div className="legendContent">
                    <p>Planned</p>
                    <div>
                      <p className="plannedText">{statistics?.plan_to_watch}</p>
                      <p className="userText">Entries</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dropped">
                <div className="contentWrapper">
                  <img src={redSquare} height={35} width={35} />
                  <div className="legendContent">
                    <p>Dropped</p>
                    <div>
                      <p className="droppedText">{statistics?.dropped}</p>
                      <p className="userText">Entries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="graphic">
              <div
                style={{
                  width: statistics?.total
                    ? (statistics?.completed / statistics?.total) * 100 + `%`
                    : 0,
                }}
                className="completedBg"
              ></div>
              <div
                style={{
                  width: statistics?.total
                    ? (statistics?.watching / statistics?.total) * 100 + `%`
                    : 0,
                }}
                className="watchingBg"
              ></div>
              <div
                style={{
                  width: statistics?.total
                    ? (statistics?.on_hold / statistics?.total) * 100 + `%`
                    : 0,
                }}
                className="pausedBg"
              ></div>
              <div
                style={{
                  width: statistics?.total
                    ? (statistics?.plan_to_watch / statistics?.total) * 100 +
                      `%`
                    : 0,
                }}
                className="plannedBg"
              ></div>
              <div
                style={{
                  width: statistics?.total
                    ? (statistics?.dropped / statistics?.total) * 100 + `%`
                    : 0,
                }}
                className="droppedBg"
              ></div>
            </div>
          </div>

          <div className="section">
            <label className="detailsH3">Details</label>
            <div className="details">
              <div>
                <label>Studio</label>
                <p>{anime?.studios[0].name}</p>
              </div>
              <div>
                <label>Ranked</label>
                <p>#{anime?.rank}</p>
              </div>
              <div>
                <label>Popularity</label>
                <p>#{anime?.popularity}</p>
              </div>
              <div>
                <label>Type</label>
                <p>{anime?.type}</p>
              </div>
              <div>
                <label>Source</label>
                <p>{anime?.source}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;
