import { useState, useEffect } from "react";
import styles from './Clock.module.css';

function Clock() {
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('clock');
    const [quizTime, setQuizTime] = useState<Date | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState<number>(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date()); // Crée une nouvelle date à chaque fois
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const generateRandomTime = () => {
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinutes = Math.floor(Math.random() * 60);
        const newTime = new Date();

        newTime.setHours(randomHour);
        newTime.setMinutes(randomMinutes);

        setQuizTime(newTime);
    }

    const getTimeOfDay = (date: Date) => {
        const hour = date.getHours();

        if (hour >= 6 && hour < 12) {
            return {
                period: 'morning',
                icon: '☀️',
                gradient: 'linear-gradient(135deg, #ffeaa7 0%, #74b9ff 100%)'
            };
        } else if (hour >= 12 && hour < 18) {
            return {
                period: 'afternoon',
                icon: '☀️',
                gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
            };
        } else if (hour >= 18 && hour < 22) {
            return {
                period: 'evening',
                icon: '🌙',
                gradient: 'linear-gradient(135deg, #fd79a8 0%, #a29bfe 100%)'
            };
        } else {
            return {
                period: 'night',
                icon: '🌙',
                gradient: 'linear-gradient(135deg, #2d3436 0%, #000428 100%)'
            };
        }
    }

    const checkAnswer = () => {
        console.log('checkAnswer appelée !');
        console.log('userAnswer:', userAnswer);
        console.log('quizTime:', quizTime);
        if (!quizTime) return;

        const correctHour = quizTime.getHours();
        const correctMinutes = quizTime.getMinutes();

        // Créer la réponse correcte au format "14:30"
        const correctAnswer = `${correctHour}:${correctMinutes.toString().padStart(2, '0')}`;

        // Normaliser la réponse de l'utilisateur
        const normalizedAnswer = userAnswer.replace('h', ':').replace('H', ':');

        // Comparer avec userAnswer
        if (normalizedAnswer === correctAnswer) {
            setScore(score + 1);
            setUserAnswer('');
            generateRandomTime();
            setMessage('🎉 Bravo ! C\'est correct !');
        } else {
            setMessage(`❌ Essaie encore ! La bonne réponse était ${correctAnswer}`);
            setUserAnswer('');
            setTimeout(() => {
                generateRandomTime();
                setMessage('');
            }, 2000);
        }
    }

    const renderQuizMode = () => {
        return (
            <div className={styles.quizContainer}>
                <h2 className={styles.quizTitle}>Quelle heure est-il ? ⏰</h2>

                <input
                    className={styles.quizInput}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Ex: 14:30"
                />

                <button className={styles.quizButton} onClick={checkAnswer}>
                    Vérifier
                </button>

                <div className={styles.score}>Score : {score} 🌟</div>

                {message && (
                    <div className={`${styles.message} ${message.includes('Bravo') ? styles.success : styles.error}`}>
                        {message}
                    </div>
                )}
            </div>
        );
    };

    const renderDigitalClock = () => {
        return (
            <div className={styles.digitalClock}>
                {time.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                })}
            </div>
        );
    };

    const renderModeButtons = () => {
        return (
            <div className={styles.modeButtons}>
                <button
                    className={`${styles.modeButton} ${mode === 'clock' ? styles.active : ''}`}
                    onClick={() => setMode('clock')}
                >
                    Horloge en direct
                </button>
                <button
                    className={`${styles.modeButton} ${mode === 'quiz' ? styles.active : ''}`}
                    onClick={() => {
                        setMode('quiz');
                        generateRandomTime();
                    }}
                >
                    Mode Quiz
                </button>
            </div>
        );
    };

    const renderAnalogClock = () => {
        const displayTime = mode === 'quiz' && quizTime ? quizTime : time; // "Si on est en mode quiz ET que quizTime existe, utilise quizTime, sinon utilise time"

        const hours = displayTime.getHours();
        const minutes = displayTime.getMinutes();
        const seconds = displayTime.getSeconds();

        const hourAngle = (hours % 12) * 30 + minutes * 0.5;
        const minuteAngle = mode === 'quiz' ? minutes * 6 : minutes * 6 + seconds * 0.1;
        const secondAngle = seconds * 6;


        return (
            <div className={styles.clockContainer}>
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
                        y2="50"
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
            </div>
        )
    }

    const currentDisplayTime = mode === 'quiz' && quizTime ? quizTime : time;
    const timeContext = getTimeOfDay(currentDisplayTime);

    return (
        <div className={styles.container} style={{ background: timeContext.gradient }}>
            <div className={styles.timeIcon}>{timeContext.icon}</div>
            {renderModeButtons()}
            {renderAnalogClock()}
            {mode === 'clock' && renderDigitalClock()}
            {mode === 'quiz' && renderQuizMode()}
        </div>
    );
}

export default Clock;