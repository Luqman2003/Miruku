import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Firebase/firebase";
import greenSquare from "../../Assets/GreenSquare.svg";
import blueSquare from "../../Assets/BlueSquare.svg";
import orangeSquare from "../../Assets/OrangeSquare.svg";
import yellowSquare from "../../Assets/YellowSquare.svg";
import redSquare from "../../Assets/RedSquare.svg";
import { fetchDataFromApi } from "../../Api/api";
import Loading from "./Loading";
import KeyDetails from "../Elements/KeyDetails";
import BasicDetails from "../Elements/BasicDetails";
import StatusDropdown from "../Elements/StatusDropdown";
import BarGraphic from "../Elements/BarGraphic";

interface Statistics {
  completed: number;
  completedFormatted: string;
  watching: number;
  watchingFormatted: string;
  on_hold: number;
  on_holdFormatted: string;
  plan_to_watch: number;
  plan_to_watchFormatted: string;
  dropped: number;
  droppedFormatted: string;
  total: number;
  totalFormatted: string;
}

const DetailsPage = () => {
  const location = useLocation();
  const anime = location.state?.anime;

  const [episodes, setEpisodes] = useState([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  // To be passed into StatusDropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [userAnimeStatus, setUserAnimeStatus] = useState("");

  // Helper function to format numbers with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  // Fetches episodes and statistics data
  useEffect(() => {
    const fetchData = async () => {
      // Retrieves episodes data
      const eps = await fetchDataFromApi(`anime/${anime.mal_id}/episodes`);
      setEpisodes(eps.data);

      // Retrieves statistics data
      const stats = await fetchDataFromApi(`anime/${anime.mal_id}/statistics`);

      // Prepare statistics with both raw and formatted values
      const formattedStats: Statistics = {
        completed: stats.data.completed,
        completedFormatted: formatNumber(stats.data.completed),
        watching: stats.data.watching,
        watchingFormatted: formatNumber(stats.data.watching),
        on_hold: stats.data.on_hold,
        on_holdFormatted: formatNumber(stats.data.on_hold),
        plan_to_watch: stats.data.plan_to_watch,
        plan_to_watchFormatted: formatNumber(stats.data.plan_to_watch),
        dropped: stats.data.dropped,
        droppedFormatted: formatNumber(stats.data.dropped),
        total: stats.data.total,
        totalFormatted: formatNumber(stats.data.total),
      };
      setStatistics(formattedStats);

      // Checks if user is logged in, and checks if the current anime is in the user's list
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
          <StatusDropdown
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              userAnimeStatus={userAnimeStatus}
              setUserAnimeStatus={setUserAnimeStatus}
          />

          <div className="section">
            <KeyDetails anime={anime}/>
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
                      <p className="completedText">{statistics?.completedFormatted}</p>
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
                      <p className="watchingText">{statistics?.watchingFormatted}</p>
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
                      <p className="pausedText">{statistics?.on_holdFormatted}</p>
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
                      <p className="plannedText">{statistics?.plan_to_watchFormatted}</p>
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
                      <p className="droppedText">{statistics?.droppedFormatted}</p>
                      <p className="userText">Entries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <BarGraphic statistics={statistics!}/>
          </div>

          <div className="section">
            <label className="detailsH3">Details</label>
            <BasicDetails/>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsPage;
