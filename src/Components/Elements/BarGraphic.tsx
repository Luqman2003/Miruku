import React from "react";
import "../../Stylesheets/AnimePage.css"

interface Statistics {
    completed: number;
    watching: number;
    on_hold: number;
    plan_to_watch: number;
    dropped: number;
    total: number;
}

interface GraphicProps {
    statistics: Statistics;
}

const Graphic: React.FC<GraphicProps> = ({ statistics }) => {
    const { completed, watching, on_hold, plan_to_watch, dropped, total } = statistics;

    // Define an array to map each statistic to its corresponding className
    const bars = [
        { value: completed, className: "completedBg" },
        { value: watching, className: "watchingBg" },
        { value: on_hold, className: "pausedBg" },
        { value: plan_to_watch, className: "plannedBg" },
        { value: dropped, className: "droppedBg" },
    ];

    const calculateWidth = (value: number, total: number) => (total ? (value / total) * 100 : 0);

    return (
        <div className="graphic">
            {bars.map((bar, index) => (
                <div
                    key={index}
                    style={{ width: `${calculateWidth(bar.value, total)}%` }}
                    className={`barBg ${bar.className}`}
                ></div>
            ))}
        </div>
    );
};

export default Graphic;