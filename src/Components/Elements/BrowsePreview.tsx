import FetchImages from '../FetchImages';
import {useNavigate } from 'react-router-dom';
import React from "react";


interface Anime {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
}

interface BrowsePreviewProps {
    data: any;
    limit?: number;
    label: string;
}

const BrowsePreview: React.FC<BrowsePreviewProps> = ({ data, limit, label}) => {
    const animeEntries = data.data.data.slice(0, limit);
    const navigate = useNavigate();

    const browseRedirect = () => {
        navigate("/browse");
    };

    const animeRedirect = (anime: Anime) => {
        navigate(`/anime/${anime.title}`, { state: { anime } });
    };

    return (
        <div className="cardContainer">
            <h3 className="cardCategory" onClick={browseRedirect}>{label}</h3>
            <div className="card">
                {animeEntries.map((anime: Anime) => (
                    <div key={anime.mal_id} className={"cardImage"} onClick={() => animeRedirect(anime)}>
                        <FetchImages imageUrl={anime.images.jpg.image_url}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrowsePreview;