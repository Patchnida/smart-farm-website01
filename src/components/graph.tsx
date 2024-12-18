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

// Group time into specific ranges
const groupTime = (time: string) => {
    const [hours] = time.split(":").map(Number); // Extract hour as number
    if (hours >= 0 && hours < 6) return "00.00";
    if (hours >= 6 && hours < 12) return "06.00";
    if (hours >= 12 && hours < 18) return "12.00";
    if (hours >= 18 && hours < 24) return "18.00";
    return "00.00";
};

// Transform API data and group it by time
const transformData = (data) => {
    const groupedData = {
        "00.00": [],
        "06.00": [],
        "12.00": [],
        "18.00": [],
    };

    data.forEach((item, index) => {
        const date = new Date(item.date);
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const time = `${hours}:${minutes}`; // Format HH:MM

        // Group data into time slots
        const group = groupTime(time);
        groupedData[group].push({
            id: index + 1,
            time: time,
            temp: item.temperature_id?.value || 0,
            humid: item.air_humidity_id?.value || 0,
            moisture: item.soil_moisture_id?.value || 0,
        });
    });

    console.log("Grouped Data by Time:", groupedData); // Debugging grouped data
    return groupedData;
};

function Graph({
    selectedTime,
    setSelectedTime,
}: {
    selectedTime: string;
    setSelectedTime: (time: string) => void;
}) {
    const [dataType, setDataType] = useState<string>("temp");
    const [data, setData] = useState<any[]>([]);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/api/getByLogger");

            // Transform and group data
            const groupedData = transformData(response.data);

            // Use selected time to display the correct group
            const filteredData = groupedData[selectedTime] || [];

            console.log("Filtered Data for Time Group:", selectedTime, filteredData);
            setData(filteredData);
        } catch (error) {
            console.error("Error fetching IoT data:", error);
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTime]);

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
                    <div className="flex-1">
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
                                    dataKey="id"
                                    label={{
                                        value: "ID",
                                        position: "insideBottom",
                                        offset: -10,
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
                                        offset: -10,
                                    }}
                                />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
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
