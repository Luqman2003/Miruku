import {useLocation} from "react-router-dom";
import "../../Stylesheets/AnimePage.css"

const BasicDetails = () => {
    const location = useLocation();
    const anime = location.state?.anime;

    const details = [
        { label: "Studio", value: anime?.studios[0]?.name },
        { label: "Ranked", value: `#${anime?.rank}` },
        { label: "Popularity", value: `#${anime?.popularity}` },
        { label: "Type", value: anime?.type },
        { label: "Source", value: anime?.source },
    ];

    return (
        <div className="details">
            {details.map((detail, index) => (
                <div key={index}>
                    <label>{detail.label}</label>
                    <p>{detail.value}</p>
                </div>
            ))}
        </div>
    );
};

export default BasicDetails;