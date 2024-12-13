import { useEffect, useState } from 'react';
import { fetchDataFromApi } from "../../Api/api";
import { ring } from 'ldrs';
import Loading from "./Loading";
import SearchBar from "../SearchBar/SearchBar";
import BrowsePreview from "../Elements/BrowsePreview";
import "../../Home.css";

type Anime = {
    mal_id: number;
    title: string;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
            small_image_url: string;
        };
    };
};

type CachedAnimeData = {
    data: Anime[];
    timestamp: number;
}

const Home: React.FC = () => {
    const [airingData, setAiringData] = useState<CachedAnimeData>(JSON.parse(localStorage.getItem('airingData') || '[]'));
    const [trendingData, setTrendingData] = useState<CachedAnimeData>(JSON.parse(localStorage.getItem('trendingData') || '[]'));
    const [upcomingData, setUpcomingData] = useState<CachedAnimeData>(JSON.parse(localStorage.getItem('upcomingData') || '[]'));
    const [loading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState("");

    ring.register();

    useEffect(() => {
        const fetchData = async () => {
            const cacheExpiry = 86400000;
            const now = Date.now();

            const trendingDataCached: CachedAnimeData | null = JSON.parse(localStorage.getItem('trendingData') || 'null');

            const isTrendingExpired = trendingDataCached && (now - trendingDataCached.timestamp > cacheExpiry);

            if (isTrendingExpired || trendingDataCached?.timestamp == null) {
                try {
                    const trendingResponse = await fetchDataFromApi("anime?filter=airing");
                    const airingResponse = await fetchDataFromApi("seasons/now");
                    const upcomingResponse = await fetchDataFromApi("seasons/upcoming");

                    const cachedTrendingData = { data: trendingResponse, timestamp: now };
                    localStorage.setItem('trendingData', JSON.stringify(cachedTrendingData));
                    setTrendingData(cachedTrendingData);

                    const cachedAiringData = { data: airingResponse, timestamp: now };
                    localStorage.setItem('airingData', JSON.stringify(cachedAiringData));
                    setAiringData(cachedAiringData);

                    const cachedUpcomingData = { data: upcomingResponse, timestamp: now };
                    localStorage.setItem('upcomingData', JSON.stringify(cachedUpcomingData));
                    setUpcomingData(cachedUpcomingData);
                } catch (e: any) {
                    console.error(e.message);
                } finally {
                    setLoading(false);
                }
            } else if (trendingDataCached) {
                setTrendingData(trendingDataCached);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    

    return (
        <div className="home-container">
            <div className="search-container">
                <p className="search-text">Peak awaits.</p>
                <SearchBar query={query} setQuery={setQuery}/>
            </div>
            <div className="previewContainer">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <BrowsePreview data={airingData} limit={6} label={"This Season"}/>
                        <BrowsePreview data={upcomingData } limit={6} label={"Upcoming"}/>
                        <BrowsePreview data={trendingData} limit={6} label={"Classics"}/>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
