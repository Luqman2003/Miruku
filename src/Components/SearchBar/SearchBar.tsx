import React from 'react';
import searchLogo from "../../Assets/Search.svg"
import useSearch from "../../Hooks/useSearch";

interface SearchBarProps {
    query: string,
    setQuery: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery }) => {
    const { response, error, loading, fetchAnimeData } = useSearch();

    const handleSearch = async () => {
        if (query) {
            const endpoint = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`;
            await fetchAnimeData(endpoint); // Call the API with the constructed endpoint
            console.log(response);
        }
    }

    return (
        <>
            <div className="search-bar-container"
                style={{
                    display: "flex",
                    justifyContent: "start",
                    background: "white",
                    padding: "0.75rem",
                    borderRadius: "16px",
                    gap: "10px",
                    alignItems: "center",
                }}
            >

                <img src={searchLogo} alt="looking-glass" height={16} width={16}/>
                <input
                    className="search-bar"
                    placeholder="Search"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        border: "none",
                        padding: "0.2rem",
                        fontSize: "1.250rem",
                        lineHeight: "1.5", // Set line height for better vertical alignment
                        width: "100%",
                    }}
                />
            </div>
        </>

);
}

export default SearchBar;
