import { useState, useEffect } from 'react';

export function Counter() {
    const calculateTimeLeft = () => {
        const targetDate = new Date('September 13, 2024 00:00:00').getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <div className="flex gap-5">
                <div>
                    <span className="countdown font-mono text-4xl">
                        <span style={{ "--value": timeLeft.days || 0 }}></span>
                    </span>
                    days
                </div>
                <div>
                    <span className="countdown font-mono text-4xl">
                        <span style={{ "--value": timeLeft.hours || 0 }}></span>
                    </span>
                    hours
                </div>
                <div>
                    <span className="countdown font-mono text-4xl">
                        <span style={{ "--value": timeLeft.minutes || 0 }}></span>
                    </span>
                    min
                </div>
                <div>
                    <span className="countdown font-mono text-4xl">
                        <span style={{ "--value": timeLeft.seconds || 0 }}></span>
                    </span>
                    sec
                </div>
            </div>
        </>
    );
}
