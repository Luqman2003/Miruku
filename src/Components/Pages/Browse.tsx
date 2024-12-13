import { useEffect, useState } from 'react';
import FetchAndDisplayImage from '../FetchImages';
import { useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from "../../Api/api";

interface Anime {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
}

const Browse = () => {
    const [animeEntries, setAnimeEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimeEntries = async () => {
            const cachedData = localStorage.getItem('airingData');
            let data;
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                const expiry = 86400000;
                const now = Date.now();
                if (now - parsedData.timestamp < expiry) {
                    data = parsedData.data;
                }
            }
            if (!data) {
                try {
                    data = await fetchDataFromApi("seasons/nowg");
                    localStorage.setItem('airingData', JSON.stringify({ data, timestamp: Date.now() }));
                } catch (e:any) {
                    console.error(e.message);
                    navigate("/404");
                }
            }
            setAnimeEntries(data.data?.slice(0));
            setLoading(false);
        };
        fetchAnimeEntries();
    }, []);

    const animeRedirect = (anime: Anime) => {
        navigate(`/anime/${anime.title}`, { state: { anime } });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="browseContainer">
            <div className="innnerContainer">
                <h3 className="cardCategory">Current Anime</h3>
                <div className="card">
                    {animeEntries.map((anime: Anime) => (
                        <div key={anime.mal_id} className="cardImage" onClick={() => animeRedirect(anime)}>
                            <FetchAndDisplayImage imageUrl={anime.images.jpg.image_url} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Browse;