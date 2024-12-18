'use client';

import React, { useState, useEffect } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { axiosInstance } from "@/lib/axiosInstance";
import { groupTime } from "@/utils/DataContext";

const transformData = (data) => {
    const groupedData = {
        "00.00": [],
        "06.00": [],
        "12.00": [],
        "18.00": [],
    };

    data.forEach((item, index) => {
        const date = new Date(item.date);
        const formattedDate = date.toISOString().split("T")[0];
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const time = `${hours}:${minutes}`; 

        const group = groupTime(time); 
        groupedData[group].push({
            id: item._id,
            transID: String(index + 1).padStart(4, "0"),
            time: time,
            date: formattedDate,
            temp: item.temperature_id?.value || 0,
            humid: item.air_humidity_id?.value || 0,
            moisture: item.soil_moisture_id?.value || 0,
        });
    });

    // console.log("Grouped Data by Time:", groupedData);
    return groupedData;
};


function Graph({
    selectedDate,
    selectedTime,
    setSelectedTime,
}: {
    selectedDate: Date | null;
    selectedTime: string;
    setSelectedTime: (time: string) => void;
}) {
    const [dataType, setDataType] = useState<string>("temp");
    const [data, setData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/api/getByLogger");
            const groupedData = transformData(response.data);

            // Filter data based on selectedDate and selectedTime
            const filteredData =
                groupedData[selectedTime]?.filter((item) => {
                    if (!selectedDate) return false;
                    const itemDate = new Date(item.date).toDateString();
                    const selectedDateString = selectedDate.toDateString();
                    return itemDate === selectedDateString;
                }) || [];

            console.log("Filtered Data for Graph:", filteredData);
            setData(filteredData);
        } catch (error) {
            console.error("Error fetching IoT data:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate, selectedTime]);

    const handleDataTypeChange = (type: string) => {
        setDataType(type);
    };

    const handleTimeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedTime(event.target.value as string);
    };

    return (
        <div className="flex flex-col w-full h-full">
            {/* Time Selection Dropdown */}
            <div className="flex my-4">
                <FormControl variant="outlined" style={{ minWidth: 200 }}>
                    <InputLabel>เลือกเวลา</InputLabel>
                    <Select
                        value={selectedTime}
                        onChange={handleTimeChange}
                        label="เลือกเวลา"
                    >
                        {["00.00", "06.00", "12.00", "18.00"].map((time) => (
                            <MenuItem key={time} value={time}>
                                {time}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="flex flex-row w-full h-full">
                {/* Graph Section */}
                {data.length === 0 ? (
                    <div className="text-center mt-10 text-gray-500 w-full">
                        No data available for the selected time.
                    </div>
                ) : (
                    <div className="flex-1 mb-5">
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart
                                data={data}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="transID"
                                    label={{
                                        value: "ID",
                                        position: "insideBottom",
                                        offset:-0,
                                    }}
                                />
                                <YAxis
                                    label={{
                                        value:
                                            dataType === "temp"
                                                ? "อุณหภูมิ (°C)"
                                                : dataType === "moisture"
                                                ? "ความชื้นในดิน (%)"
                                                : "ความชื้นในอากาศ (%)",
                                        angle: -90,
                                        position: "insideLeft",
                                        offset: 10,
                                    }}
                                />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip
                                    labelFormatter={(label, payload) => {
                                        const item = payload?.[0]?.payload;
                                        return item ? `Date: ${item.date}, Time: ${item.time}` : label;
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey={dataType}
                                    stroke="#4caf50"
                                    fillOpacity={1}
                                    fill="url(#color)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Data Type Buttons */}
                <div className="flex flex-col ml-4 space-y-2">
                    {["temp", "humid", "moisture"].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleDataTypeChange(type)}
                            className={`w-40 rounded-lg py-2 ${
                                dataType === type
                                    ? "bg-green-500 text-white font-semibold hover:bg-green-600"
                                    : "bg-gray-200 hover:bg-gray-300 font-semibold"
                            }`}
                        >
                            {type === "temp" ? "อุณหภูมิ" : type === "humid" ? "ความชื้นในอากาศ" : "ความชื้นในดิน"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Graph;
