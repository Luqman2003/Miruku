import { doc, getDocs, updateDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Firebase/firebase";
import defaultBanner from "../../Assets/defaultBanner.png";
import { useEffect } from "react";
import { useState } from "react";
import add from "../../Assets/Add.svg";
import subtract from "../../Assets/Subtract.svg";

interface StatusToAnime {
  [key: string]: string[]; // Keys are strings, values are arrays of strings
}

const AnimeList = () => {
  const navigate = useNavigate();
  const [statusToAnime, setStatusToAnime] = useState<StatusToAnime>({});

  useEffect(() => {
    const fetchAnimeList = async (animeListRef: any) => {
      try {
        const querySnapshot = await getDocs(animeListRef);
        const newStatusToAnime: any = {};

        querySnapshot.forEach((doc) => {
          const animeData: any = doc.data();
          const { status, title } = animeData;

          if (!newStatusToAnime[status]) {
            newStatusToAnime[status] = [];
          }

          newStatusToAnime[status].push(title);
        });

        setStatusToAnime(newStatusToAnime);
      } catch (error) {
        console.error("error fetching animeList: ", error);
      }
    };
    if (auth.currentUser && auth.currentUser.uid) {
      const animeListRef = collection(
        doc(db, "Users", auth.currentUser?.uid),
        "AnimeList"
      );
      fetchAnimeList(animeListRef);
    }
  }, []);

  useEffect(() => {
    console.log("Status to Anime Mapping: ", statusToAnime);
  }, [statusToAnime]);

  const profileRedirect = () => {
    navigate(`/profile/${auth?.currentUser?.uid}`);
  };

  const animeListRedirect = () => {
    navigate(`/animeList/${auth?.currentUser?.uid}`);
  };

  const ratingCategories = [
    "Completed",
    "Watching",
    "Paused",
    "Planned",
    "Dropped",
  ];
  return (
    <div className="animeListContainer">
      <div className="subNav">
        <div className="directory">
          <div onClick={profileRedirect}>Overview</div>
          <div onClick={animeListRedirect}>Anime List</div>
        </div>
      </div>
      <img src={defaultBanner} alt="Profile Banner" className="profileBanner" />
      <div className="horizontalDivider"></div>

      {ratingCategories.map((category) => (
        <div key={category} className="categoryContainer">
          <h3>{category}</h3>
          <div className="blackSection">
            <div className="listHeader">
              <label className="listTile">Title</label>
              <div className="listScoreProgress">
                <label>Score</label>
                <label>Progress</label>
              </div>
            </div>
            <div className="horizontalDividerW"></div>
            <div className="listHeader">
              {Object.keys(statusToAnime).map((key) => {
                if (category === "Completed" && key === "Completed") {
                  return (
                    <div className="animeListRow" key={key}>
                      <div>
                        {" "}
                        {statusToAnime[key].map((anime) => (
                          <div className="animeListRow">
                            <label className="listTitle">{anime}</label>
                            <div className="entrieScoreProgress">
                              <div className="incrementContainer">
                                <img
                                  src={subtract}
                                  alt="subtract"
                                  height={18}
                                  width={18}
                                  className="sub"
                                />
                                <label>0</label>
                                <img
                                  src={add}
                                  alt="add"
                                  height={18}
                                  width={18}
                                  className="add"
                                />
                              </div>
                            </div>
                            <div className="incrementContainer">
                              <img
                                src={subtract}
                                alt="subtract"
                                height={18}
                                width={18}
                                className="sub"
                              />
                              <label>0</label>
                              <img
                                src={add}
                                alt="add"
                                height={18}
                                width={18}
                                className="add"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (category === "Watching" && key === "Watching") {
                  const list = statusToAnime["Watching"];
                  return (
                    <div className="animeListRow" key={key}>
                      <div>
                        {" "}
                        {statusToAnime[key].map((anime) => (
                          <div className="animeListRow">
                            <label className="listTitle">{anime}</label>
                            <div className="entrieScoreProgress">
                              <div className="incrementContainer">
                                <img
                                  src={subtract}
                                  alt="subtract"
                                  height={18}
                                  width={18}
                                  className="sub"
                                />
                                <label>0</label>
                                <img
                                  src={add}
                                  alt="add"
                                  height={18}
                                  width={18}
                                  className="add"
                                />
                              </div>
                            </div>
                            <div className="incrementContainer">
                              <img
                                src={subtract}
                                alt="subtract"
                                height={18}
                                width={18}
                                className="sub"
                              />
                              <label>0</label>
                              <img
                                src={add}
                                alt="add"
                                height={18}
                                width={18}
                                className="add"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (category === "Paused" && key === "Paused") {
                  return (
                    <div className="animeListRow" key={key}>
                      <div>
                        {" "}
                        {statusToAnime[key].map((anime) => (
                          <div className="animeListRow">
                            <label className="listTitle">{anime}</label>
                            <div className="entrieScoreProgress">
                              <div className="incrementContainer">
                                <img
                                  src={subtract}
                                  alt="subtract"
                                  height={18}
                                  width={18}
                                  className="sub"
                                />
                                <label>0</label>
                                <img
                                  src={add}
                                  alt="add"
                                  height={18}
                                  width={18}
                                  className="add"
                                />
                              </div>
                            </div>
                            <div className="incrementContainer">
                              <img
                                src={subtract}
                                alt="subtract"
                                height={18}
                                width={18}
                                className="sub"
                              />
                              <label>0</label>
                              <img
                                src={add}
                                alt="add"
                                height={18}
                                width={18}
                                className="add"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (category === "Planned" && key === "Plan to Watch") {
                  return (
                    <div className="animeListRow" key={key}>
                      <div>
                        {" "}
                        {statusToAnime[key].map((anime) => (
                          <div className="animeListRow">
                            <label className="listTitle">{anime}</label>
                            <div className="entrieScoreProgress">
                              <div className="incrementContainer">
                                <img
                                  src={subtract}
                                  alt="subtract"
                                  height={18}
                                  width={18}
                                  className="sub"
                                />
                                <label>0</label>
                                <img
                                  src={add}
                                  alt="add"
                                  height={18}
                                  width={18}
                                  className="add"
                                />
                              </div>
                            </div>
                            <div className="incrementContainer">
                              <img
                                src={subtract}
                                alt="subtract"
                                height={18}
                                width={18}
                                className="sub"
                              />
                              <label>0</label>
                              <img
                                src={add}
                                alt="add"
                                height={18}
                                width={18}
                                className="add"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else if (category === "Dropped" && key === "Dropped") {
                  return (
                    <div className="animeListRow" key={key}>
                      <div>
                        {" "}
                        {statusToAnime[key].map((anime) => (
                          <div className="animeListRow">
                            <label className="listTitle">{anime}</label>
                            <div className="entrieScoreProgress">
                              <div className="incrementContainer">
                                <img
                                  src={subtract}
                                  alt="subtract"
                                  height={18}
                                  width={18}
                                  className="sub"
                                />
                                <label>0</label>
                                <img
                                  src={add}
                                  alt="add"
                                  height={18}
                                  width={18}
                                  className="add"
                                />
                              </div>
                            </div>
                            <div className="incrementContainer">
                              <img
                                src={subtract}
                                alt="subtract"
                                height={18}
                                width={18}
                                className="sub"
                              />
                              <label>0</label>
                              <img
                                src={add}
                                alt="add"
                                height={18}
                                width={18}
                                className="add"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

{
  /* <div className="horizontalDividerW">
{Object.keys(statusToAnime).map((key) => {
  if (category === "Completed" && key === "Completed") {
    return (
      <div key={key}>
        {statusToAnime[key].map((anime) => (
          <p>{anime}</p>
        ))}
      </div>
    );
  } else if (category === "Watching" && key === "Watching") {
    const list = statusToAnime["Watching"];
    return (
      <div key={key}>
        {list.map((anime) => (
          <p>{anime}</p>
        ))}
      </div>
    );
  }
  // Add cases for "Paused" and "Dropped" here if needed
  return null; // Default return
})}
</div> */
}

export default AnimeList;
