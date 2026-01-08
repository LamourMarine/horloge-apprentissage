import { useState, useEffect } from "react";

function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date()); // Crée une nouvelle date à chaque fois
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const renderDigitalClock = () => {
        return <div>{time.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })}</div>;
    };

    const renderAnalogClock = () => {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        const hourAngle = (hours % 12) * 30 + minutes * 0.5;
        const minuteAngle = minutes * 6 + seconds * 0.1;
        const secondAngle = seconds * 6;

        return (
            <svg width="300" height="300" viewBox="0 0 300 300"> {/*viewBox: systeme de coordonnees*/}
                <circle
                    cx="150"     // centre X (milieu de 300)
                    cy="150"     // centre Y (milieu de 300)
                    r="140"      // rayon
                    fill="white" // couleur intérieure
                    stroke="black" // couleur du contour
                    strokeWidth="4" // épaisseur du contour
                />
                {Array.from({ length: 60 }).map((_, i) => {
                    const isHourMark = i % 5 === 0;
                    const radiusStart = isHourMark ? 125 : 132;
                    const radiusEnd = 140;

                    const angle = (i * 6 - 90) * (Math.PI / 180);
                    const x1 = 150 + radiusStart * Math.cos(angle);
                    const y1 = 150 + radiusStart * Math.sin(angle);
                    const x2 = 150 + radiusEnd * Math.cos(angle);
                    const y2 = 150 + radiusEnd * Math.sin(angle);

                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 5 === 0 ? 3 : 1} stroke="black"
                    ></line>
                })}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((number) => {
                    const angle = (number * 30 - 90) * (Math.PI / 180); // convertir en radians
                    const x = 150 + 110 * Math.cos(angle); //Position X
                    const y = 150 + 110 * Math.sin(angle); //Position Y

                    return (
                        <text key={number} x={x} y={y} textAnchor="middle" fontSize="20">
                            {number}
                        </text>
                    );
                })}
                <line
                    x1="150" // Point de depard X (centre)
                    y1="150" //Point de depart Y (centre)
                    x2="150" // POint d'arrivée X
                    y2="80" // Point d'arrivée Y (vers le haut)
                    stroke="black"
                    strokeWidth="5"
                    transform={`rotate(${hourAngle} 150 150)`} // Rotation (angle, centreX, centreY)
                />
                <line
                    x1="150"
                    y1="150"
                    x2="150"
                    y2="60"
                    stroke="blue"
                    strokeWidth="3"
                    transform={`rotate(${minuteAngle} 150 150)`}
                    
                />
                <line
                    x1="150"
                    y1="150"
                    x2="150"
                    y2="50"
                    stroke="red"
                    strokeWidth="1.5"
                    transform={`rotate(${secondAngle} 150 150)`}
                />
            </svg>
        )
    }

    return (
        <div>
            {renderAnalogClock()}
            {renderDigitalClock()}
        </div>
    );
}

export default Clock;