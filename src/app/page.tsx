'use client';

import React from "react";
import { useDate } from "../utils/DataContext";
import Graph from "@/components/graph";
import Table from "@/components/table";

const Home: React.FC = () => {
    const { selectedDate, selectedTime, setSelectedTime } = useDate();

    const formatDateToThai = (date: Date | undefined): string => {
        if (!date) return "Invalid date";

        const dayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const monthNames = [
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม",
        ];

        const dayName = dayNames[date.getDay()];
        const day = date.getDate();
        const monthName = monthNames[date.getMonth()];
        const buddhistYear = date.getFullYear() + 543;

        return `${dayName}ที่ ${day} ${monthName} ${buddhistYear}`;
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] h-full">
            <main className="flex flex-col w-full h-fit items-center">
                <div className="w-11/12 h-5/6 mt-5 p-10 bg-white rounded-lg shadow-sm">
                    <p className="text-3xl font-bold">{formatDateToThai(selectedDate)}</p>
                    <Graph selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                </div>
                <div className="w-11/12 h-5/6 my-5 p-10 bg-white rounded-lg shadow-sm">
                    <Table selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                </div>
            </main>
        </div>
    );
};

export default Home;
