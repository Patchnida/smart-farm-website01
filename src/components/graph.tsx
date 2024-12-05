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
import { useDate } from "@/utils/DataContext";

type IoTData = {
    id: number;
    temp: number;
    humid: number;
    moisture: number;
};

const flattenData = (data: any[], selectedTime: string): IoTData[] => {
    if (!Array.isArray(data)) {
        console.error("Expected an array, but received:", data);
        return [];
    }

    const selectedEntry = data.find((entry) => entry.time === selectedTime);
    if (!selectedEntry || !selectedEntry.detail || !Array.isArray(selectedEntry.detail)) {
        console.warn(
            "No matching entry found or invalid detail structure for the selected time:",
            selectedTime
        );
        return [];
    }

    return selectedEntry.detail.map((item: any) => ({
        id: item.id,
        temp: parseFloat(item.temp?.replace("°C", "") || "0"),
        humid: parseFloat(item.humid?.replace("%", "") || "0"),
        moisture: parseFloat(item.moisture?.replace("%", "") || "0"),
    }));
};

function Graph() {
    const { selectedTime, setSelectedTime } = useDate();
    const [dataType, setDataType] = useState<"temp" | "humid" | "moisture">("temp");
    const [data, setData] = useState<IoTData[]>([]);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/api/getByLogger");
            console.log("Raw API Response:", response.data);

            const processedData = flattenData(response.data, selectedTime);
            console.log("Processed Data:", processedData);

            setData(processedData);
        } catch (error) {
            console.error("Error fetching IoT data:", error);
        }
    };

    useEffect(() => {
        if (selectedTime) {
            fetchData();
        } else {
            console.warn("Selected time is not set.");
        }
    }, [selectedTime]);

    const handleTimeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedTime(event.target.value as string);
    };

    const handleDataTypeChange = (type: "temp" | "humid" | "moisture") => {
        setDataType(type);
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
                                    <linearGradient
                                        id="color"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#4caf50"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#4caf50"
                                            stopOpacity={0}
                                        />
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
                            {type === "temp"
                                ? "อุณหภูมิ"
                                : type === "humid"
                                ? "ความชื้นในอากาศ"
                                : "ความชื้นในดิน"}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Graph;
