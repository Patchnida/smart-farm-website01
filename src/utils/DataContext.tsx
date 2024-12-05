'use client';

import { createContext, ReactNode, useContext, useState } from "react";

type DateContextType = {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    selectedTime: string;
    setSelectedTime: (time: string) => void;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

const getDefaultTimeOption = (): string => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 6) return "00.00";
    if (currentHour >= 6 && currentHour < 12) return "06.00";
    if (currentHour >= 12 && currentHour < 18) return "12.00";
    if (currentHour >= 18 && currentHour < 24) return "18.00";
    return "00.00";
};

export const DateProvider = ({ children }: { children: ReactNode }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>(getDefaultTimeOption());

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate, selectedTime, setSelectedTime }}>
            {children}
        </DateContext.Provider>
    );
};

export const useDate = () => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error('useDate must be used within a DateProvider');
    }
    return context;
};
