import { useEffect, useState } from 'react';

function parseDateString(dateString) {
    const [datePart, timePart] = dateString.split(' - ');
    const parsedDate = new Date(`${datePart} ${timePart.replace('.', ':')}`);
    
    if (isNaN(parsedDate.getTime())) {
        console.error(`Unable to parse date string: ${dateString}`);
    }

    return parsedDate;
}

function Notification({ id, icons, timeAgo, read, onRead }) {
    const [relativeTime, setRelativeTime] = useState('');

    useEffect(() => {
        const calculateTimeAgo = () => {
            const notificationTime = parseDateString(timeAgo);
            if (isNaN(notificationTime.getTime())) {
                setRelativeTime('Invalid date');
                return;
            }

            const now = new Date();
            const diffInMs = now.getTime() - notificationTime.getTime();
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

            if (diffInHours < 1) {
                setRelativeTime('ไม่ถึงชั่วโมงที่ผ่านมา');
            } else {
                setRelativeTime(`${diffInHours} ชั่วโมงที่ผ่านมา`);
            }
        };

        calculateTimeAgo();
    }, [timeAgo]);

    const handleRead = () => {
        if (!read) {
            console.log(`Notification ${id} marked as read`);
            onRead(id);
        }
    };

    return (
        <div>
            <button
                onClick={handleRead}
                className={`flex flex-row justify-between w-full p-5 border-b-2 border-gray-200 ${
                    read ? 'bg-white hover:bg-slate-100' : 'bg-blue-100 hover:bg-blue-200'
                }`}
            >
                <div className="flex flex-row gap-3">
                    <div>
                        {id}
                    </div>
                    <div className="flex flex-row gap-1">
                        {icons.map((icon, index) => (
                            <img key={index} src={icon.src} alt={icon.alt} className="w-6 h-6" />
                        ))}
                    </div>
                </div>
                <div>
                    <span>{relativeTime}</span>
                </div>
            </button>
        </div>
    );
}

export default Notification;
