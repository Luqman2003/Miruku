import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/firebase";
import MilkBud from "../../Assets/MilkBud.svg";
import defaultBanner from "../../Assets/defaultBanner.png";
import greenSquare from "../../Assets/GreenSquare.svg";
import blueSquare from "../../Assets/BlueSquare.svg";
import orangeSquare from "../../Assets/OrangeSquare.svg";
import yellowSquare from "../../Assets/YellowSquare.svg";
import redSquare from "../../Assets/RedSquare.svg";
import { collection, getDocs } from "firebase/firestore";

type StatusType =
  | "completed"
  | "watching"
  | "on_hold"
  | "plan_to_watch"
  | "dropped";

const Profile = () => {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState({
    completed: 0,
    watching: 0,
    on_hold: 0,
    plan_to_watch: 0,
    dropped: 0,
  });

  const total = Object.values(statistics).reduce((sum, num) => sum + num, 0);

  const isStatusKey = (key: any): key is StatusType => {
    return [
      "completed",
      "watching",
      "on_hold",
      "plan_to_watch",
      "dropped",
    ].includes(key);
  };

  useEffect(() => {
    if (!auth.currentUser) {
      console.log("User is not logged in");
      return;
    }
    const animeListRef = collection(
      db,
      "Users",
      auth.currentUser.uid,
      "AnimeList"
    );
    const fetchAnimeList = async () => {
      const snapshot = await getDocs(animeListRef);
      const stats = {
        completed: 0,
        watching: 0,
        on_hold: 0,
        plan_to_watch: 0,
        dropped: 0,
      };
      snapshot.forEach((doc) => {
        const data = doc.data();
        const statusKey = data.status?.toLowerCase() as StatusType | undefined;
        if (statusKey && isStatusKey(statusKey)) {
          stats[statusKey] += 1;
        }
      });
      setStatistics(stats);
    };
    fetchAnimeList();
  }, [auth.currentUser]);

  const profileRedirect = () => {
    navigate(`/profile/${auth?.currentUser?.uid}`);
  };

  const animeListRedirect = () => {
    navigate(`/animelist/${auth?.currentUser?.uid}`);
  };

  return (
    <div className="profileContainer">
      <div className="subNav">
        <div className="directory">
          <div onClick={profileRedirect}>Overview</div>
          <div onClick={animeListRedirect}>Anime List</div>
        </div>
      </div>
      <img src={defaultBanner} alt="" className="profileBanner" />
      <div className="underBanner">
        <img src={MilkBud} alt="" className="profileImage" />
        <div className="textContent">
          <p className="username">{localStorage.getItem("username")}</p>
          <p>A new user to Miruku :D</p>
        </div>
      </div>
      <div className="horizontalDivider"></div>

      <div className="blackSection">
        <div className="inner"></div>
        <label>My Anime Ratings</label>
        <div className="legendValues">
          <div className="completed">
            <div className="contentWrapper">
              <img src={greenSquare} alt="" height={35} width={35} />
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
              <img src={blueSquare} alt="" height={35} width={35} />
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
              <img src={orangeSquare} alt="" height={35} width={35} />
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
              <img src={yellowSquare} alt="" height={35} width={35} />
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
              <img src={redSquare} alt="" height={35} width={35} />
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
          {total > 0 ? (
            <>
              <div
                style={{ width: (statistics.completed / total) * 100 + `%` }}
                className="completedBg"
              ></div>
              <div
                style={{ width: (statistics.watching / total) * 100 + `%` }}
                className="watchingBg"
              ></div>
              <div
                style={{ width: (statistics.on_hold / total) * 100 + `%` }}
                className="pausedBg"
              ></div>
              <div
                style={{
                  width: (statistics.plan_to_watch / total) * 100 + `%`,
                }}
                className="plannedBg"
              ></div>
              <div
                style={{ width: (statistics.dropped / total) * 100 + `%` }}
                className="droppedBg"
              ></div>
            </>
          ) : (
            <div style={{ width: "100%" }} className="placeholderBg"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
