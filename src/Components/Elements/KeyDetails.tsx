import React from "react";
import "../../Stylesheets/AnimePage.css"

interface KeyDetailsProps {
    anime: any;
}

const KeyDetails: React.FC<KeyDetailsProps> = ({ anime }) => {
    return (
        <div className="keyDetails">
            <div>
                <label>Score</label>
                <p>{anime?.score}</p>
            </div>
            <div>
                <label>Status</label>
                <p>
                    {anime?.status === "Currently Airing" ? "Airing"
                    : anime?.status === "Finished Airing" ? "Finished"
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
    );
};

export default KeyDetails;