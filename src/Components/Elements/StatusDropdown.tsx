import add from "../../Assets/Add.svg";
import {auth, db} from "../../Firebase/firebase";
import {doc, setDoc} from "firebase/firestore";
import {useNavigate, useLocation } from "react-router-dom";
import "../../Stylesheets/AnimePage.css"

interface StatusDropdownProps {
    showDropdown: boolean;
    setShowDropdown: (value: boolean) => void;
    userAnimeStatus: string;
    setUserAnimeStatus: (status: string) => void;
}


const StatusDropdown = ({showDropdown, setShowDropdown, userAnimeStatus, setUserAnimeStatus}: StatusDropdownProps) => {
    const location = useLocation();
    const anime = location.state?.anime;
    const navigate = useNavigate();

    // Handles adding an anime to the user's list
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

    // Handles changing an anime's status
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

    return (
        <div className="dropdownContainer">
            {!showDropdown ? (
                <button onClick={handleAddToList}>
                    <p>Add To List</p>
                    <img src={add} alt="Add to List" height={24} width={24}/>
                </button>
            ) : (
                <select value={userAnimeStatus} onChange={handleStatusChange}>
                    <option value="Watching">Watching</option>
                    <option value="Completed">Completed</option>
                    <option value="Paused">Paused</option>
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="Dropped">Dropped</option>
                </select>
            )}
        </div>
    )
}

export default StatusDropdown;