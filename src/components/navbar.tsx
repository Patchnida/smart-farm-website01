'use client'

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDate } from '../utils/DataContext';

import Notification from './notification';

import Link from 'next/link';
import { generateNotificationIcons } from './icon';
import { initialData } from '@/app/eachIdData';
import {  isTempOutOfRange,
  isHumidOutOfRange,
  isMoistureOutOfRange,
  isDiseaseDetected,
  isNitrogenOutOfRange,
  isPhosphorusOutOfRange,
  isPotassiumOutOfRange, } from '@/utils/validation';

type NotificationDetail = {
    id: string;
    temp: number;
    humid: number;
    moisture: number;
    disease: string;
    timeAgo: string; 
    read: boolean;
    icons: { src: string; alt: string }[];
};

function NavBar() {
    const [showCalendar, setShowCalendar] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { selectedDate, setSelectedDate } = useDate();
    const [notifications, setNotifications] = useState<NotificationDetail[]>([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
      const processedNotifications = initialData.flatMap((entry) =>
          entry.detail
              .filter((detail) => {
                  return (
                      isTempOutOfRange(parseFloat(detail.temp)) ||
                      isHumidOutOfRange(parseFloat(detail.humid)) ||
                      isMoistureOutOfRange(parseFloat(detail.moisture)) ||
                      isDiseaseDetected(detail.disease)
                  );
              })
              .map((detail) => ({
                  id: `${detail.id}-${entry.time}`, 
                  temp: parseFloat(detail.temp),
                  humid: parseFloat(detail.humid),
                  moisture: parseFloat(detail.moisture),
                  disease: detail.disease,
                  timeAgo: `${entry.date} - ${entry.time}`, 
                  read: false, 
                  icons: generateNotificationIcons({
                      temp: parseFloat(detail.temp),
                      humid: parseFloat(detail.humid),
                      moisture: parseFloat(detail.moisture),
                      disease: detail.disease,
                  }),
              }))
      );
      setNotifications(processedNotifications);
  }, []);

    const toggleCalendar = () => setShowCalendar((prev) => !prev);
    const toggleNotifications = () => setShowNotifications((prev) => !prev);
    const toggleSeeMore = () => setShowAll((prev) => !prev);

    const onDateChange = (value: Date | Date[]) => {
        if (value instanceof Date) {
            setSelectedDate(value);
            console.log("Selected Date:", value);
        } else if (Array.isArray(value) && value[0] instanceof Date) {
            setSelectedDate(value[0]);
            console.log("Selected Date Range:", value);
        }
        setShowCalendar(false);
    };

    const handleRead = (id: string) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    return (
        <div className="flex items-center justify-between w-full px-5 py-3 h-16 shadow-md sticky top-0 z-50 bg-white">
            <Link href="/" className="flex items-center gap-3">
                <img
                    src="/LPKNicon2.png"
                    alt="LPKN Icon"
                    className="w-26 h-10 cursor-pointer"
                />
                <h1 className="text-lg font-semibold text-gray-800 cursor-pointer">
                    LPKN
                </h1>
            </Link>

            <div className="flex items-center gap-3 relative">
                {/* Calendar Toggle Button */}
                <button
                    className="flex justify-center items-center w-10 h-10 border border-gray-400 rounded-full cursor-pointer"
                    onClick={toggleCalendar}
                >
                    <img src="/schedule.png" alt="calendar icon" className="w-6 h-6" />
                </button>

                {/* Notifications Toggle Button */}
                {/* <button
                    className="flex justify-center items-center w-10 h-10 border border-gray-400 rounded-full cursor-pointer"
                    onClick={toggleNotifications}
                >
                    <img src="/bell.png" alt="notification icon" className="w-6 h-6" />
                </button> */}

                {/* Calendar */}
                {showCalendar && (
                    <div className="absolute top-16 right-0 shadow-lg border border-gray-200 rounded-md z-50 bg-white">
                        <Calendar onChange={onDateChange} value={selectedDate} />
                    </div>
                )}

                {/* Notifications */}
                {/* {showNotifications && (
                    <div className="absolute top-16 right-0 w-80 max-h-80 shadow-lg border border-gray-200 rounded-md z-50 bg-white overflow-y-auto animate-fadeIn">
                        {(showAll ? notifications : notifications.slice(0, 3)).map(
                        (notification) => (
                            <Notification
                                key={notification.id}
                                id={notification.id}
                                icons={notification.icons}
                                timeAgo={notification.timeAgo}
                                read={notification.read}
                                onRead={handleRead}
                            />
                        )
                )}

                        <button
                            onClick={toggleSeeMore}
                            className="w-full text-center py-2 text-blue-500 hover:text-blue-700"
                        >
                            {showAll ? "แสดงน้อยกว่านี้" : "แสดงมากกว่านี้"}
                        </button>
                    </div>
                )} */}
            </div>
        </div>
    );
}

export default NavBar;
