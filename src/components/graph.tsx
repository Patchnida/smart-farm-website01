'use client';

import React, { useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { initialData } from '@/app/eachIdData';

const flattenData = (data: typeof initialData, selectedTime: string) => {
    const selectedEntry = data.find((entry) => entry.time === selectedTime);
    if (!selectedEntry) return [];
    return selectedEntry.detail.map((item) => ({
        id: item.id,
        temp: parseFloat(item.temp.replace('°C', '')),
        humid: parseFloat(item.humid.replace('%', '')),
        moisture: parseFloat(item.moisture.replace('%', '')),
    }));
};

function Graph({ selectedTime, setSelectedTime }: { selectedTime: string; setSelectedTime: (time: string) => void }) {
    const [dataType, setDataType] = useState<string>('temp');
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(flattenData(initialData, selectedTime));
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
                        {['00.00', '06.00', '12.00', '18.00'].map((time) => (
                            <MenuItem key={time} value={time}>
                                {time}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="flex flex-row w-full h-full">
                {/* Graph Section */}
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
                                label={{ value: 'ID', position: 'insideBottom', offset: -10 }}
                            />
                            <YAxis
                                label={{
                                    value:
                                        dataType === 'temp'
                                            ? 'อุณหภูมิ (°C)'
                                            : dataType === 'moisture'
                                            ? 'ความชื้นในดิน (%)'
                                            : 'ความชื้นในอากาศ (%)',
                                    angle: -90,
                                    position: 'insideLeft',
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

                {/* Data Type Selection Buttons */}
                <div className="flex flex-col ml-4 space-y-2">
                    <button
                        onClick={() => handleDataTypeChange('temp')}
                        className={`w-40 rounded-lg py-2 ${
                            dataType === 'temp' ? 'bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600' : 'bg-gray-200 rounded-lg hover:bg-gray-300 hover:font-semibold'
                        }`}
                    >
                        อุณหภูมิ
                    </button>
                    <button
                        onClick={() => handleDataTypeChange('humid')}
                        className={`w-40 rounded-lg py-2 ${
                            dataType === 'humid' ? 'bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600' : 'bg-gray-200 rounded-lg hover:bg-gray-300 hover:font-semibold'
                        }`}
                    >
                        ความชื้นในอากาศ
                    </button>
                    <button
                        onClick={() => handleDataTypeChange('moisture')}
                        className={`w-40 rounded-lg py-2 ${
                            dataType === 'moisture' ? 'bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600' : 'bg-gray-200 rounded-lg hover:bg-gray-300 hover:font-semibold'
                        }`}
                    >
                        ความชื้นในดิน
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Graph;
