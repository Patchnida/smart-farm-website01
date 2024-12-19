'use client'

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDate } from "@/utils/DataContext";
import { useSearchParams } from "next/navigation";
import PopupDisease from "@/components/popUpDisease";
import Button from '@mui/material/Button';
import { axiosInstance } from "@/lib/axiosInstance";
import {
    isTempOutOfRange,
    getTempAdvice,
    isHumidOutOfRange,
    getHumidAdvice,
    isMoistureOutOfRange,
    getMoistureAdvice,
    isNitrogenOutOfRange,
    isPhosphorusOutOfRange,
    isPotassiumOutOfRange,
    getNitrogenAdvice,
    getPhosphorusAdvice,
    getPotassiumAdvice,
} from "@/utils/validation";

const transformData = (data) => {
    if (!Array.isArray(data)) return [];
    return data.map((item, index) => ({
        id: item._id,
        transID: index + 1,
        temp: item.temperature_id?.value || 0,
        humid: item.air_humidity_id?.value || 0,
        moisture: item.soil_moisture_id?.value || 0,
        disease: item.disease || "ไม่พบ",
        npk: {
            nitrogen: item.nitrogen_id?.value || 0,
            phosphorus: item.phosphorus_id?.value || 0,
            potassium: item.potassium_id?.value || 0,
        },
    }));
};

const Detail: React.FC = () => {
    const { id } = useParams();
    const { selectedTime } = useDate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [data, setData] = useState([]);

    const searchParams = useSearchParams();
    const transID = searchParams.get("transID");



    useEffect(() => {
        const fetchEachID = async () => {
            try {
                const response = await axiosInstance.get(`/api/getLoggerByID/${id}`);
                console.log("Raw API Response:", response.data);
    
                if (!response.data || Object.keys(response.data).length === 0) {
                    console.error("No data found for the given ID.");
                    setDetailData(null); // Set data to null for display
                    setData([]);
                    return;
                }
    
                if (Array.isArray(response.data)) {
                    const transformedData = transformData(response.data);
                    console.log("Transformed Data for Table:", transformedData);
                    setData(transformedData);
                } else {
                    console.warn("Response is not an array; using data directly.");
                    setDetailData(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setDetailData(null);
                setData([]);
            }
        };
    
        fetchEachID();
    }, [id]);
    

    if (!detailData) {
        return <p>ข้อมูลไม่พบสำหรับ ID นี้</p>;
    }

    const formatDateToThai = (dateString: string): string => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid date";

        const dayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
        ];

        const dayName = dayNames[date.getDay()];
        const day = date.getDate();
        const monthName = monthNames[date.getMonth()];
        const buddhistYear = date.getFullYear() + 543;

        return `${dayName}ที่ ${day} ${monthName} ${buddhistYear}`;
    };

    const handleOpenPopup = () => setIsPopupOpen(true);
    const handleClosePopup = () => setIsPopupOpen(false);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] h-full">
            <div className="flex flex-col w-full h-fit items-center">
                <div className="w-11/12 h-5/6 mt-5 p-10 bg-white rounded-lg shadow-sm">
                    <div className="flex flex-col gap-2 mb-5">
                        <p className="text-3xl font-bold">
                            {detailData.date ? formatDateToThai(detailData.date) : "ข้อมูลไม่พบ"}
                        </p>
                        <p className="text-2xl font-medium text-sky-700">เวลา {selectedTime} น.</p>
                    </div>
                    <p className="font-semibold text-lg mt-2">
                        ID {transID || detailData._id || "N/A"}
                    </p>

                    <div className="flex flex-wrap gap-5 mt-5 h-full">
                    
                    {/* Temperature Section */}
                    <div className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col gap-2">
                                <p className="text-2xl font-bold">อุณหภูมิในดิน</p>
                                <p>ควรอยู่ระหว่าง 24-29 °C</p>
                                <p className="my-5">
                                    ค่าปัจจุบัน:{" "}
                                    <span
                                        className={`text-3xl font-semibold ${
                                            isTempOutOfRange(Number(detailData?.temperature_id?.value ?? 0))
                                                ? "text-red-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        {detailData?.temperature_id?.value ?? "ไม่มีข้อมูล"} °C
                                    </span>
                                </p>
                                <p className="mt-2 font-bold">คำแนะนำ:</p>
                                <div>
                                    {getTempAdvice(Number(detailData?.temperature_id?.value ?? 0)).map((advice, index) => (
                                        <div key={index}>{advice}</div>
                                    ))}
                                </div>
                                    </div>
                                        <img src="/temIcon.png" alt="Temperature Icon" className="w-fit h-fit cursor-pointer" />
                                    </div>
                                </div>

                        {/* Air Humidity Section */}
                        <div className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-2">
                                    <p className="text-2xl font-bold">ความชื้นในอากาศ</p>
                                    <p>ควรอยู่ระหว่าง 60-80 %</p>
                                    <p className="my-5">
                                        ค่าปัจจุบัน:{" "}
                                        <span
                                            className={`text-3xl font-semibold ${
                                                isHumidOutOfRange(parseFloat(detailData?.air_humidity_id?.value || 0))
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {detailData?.air_humidity_id?.value || "ไม่มีข้อมูล"} %
                                        </span>
                                    </p>
                                    <p className="mt-2 font-bold">คำแนะนำ:</p>
                                    <div>
                                        {getHumidAdvice(Number(detailData?.air_humidity_id?.value ?? 0)).map((advice, index) => (
                                            <div key={index}>{advice}</div>
                                        ))}
                                    </div>
                                </div>
                                <img src="/humidIcon.png" alt="Humidity Icon" className="w-fit h-fit cursor-pointer" />
                            </div>
                        </div>

                        {/* Soil Moisture Section */}
                        <div className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-2">
                                    <p className="text-2xl font-bold">ความชื้นในดิน</p>
                                    <p>ควรอยู่ระหว่าง 24-80 %</p>
                                    <p className="my-5">
                                        ค่าปัจจุบัน:{" "}
                                        <span
                                            className={`text-3xl font-semibold ${
                                                isMoistureOutOfRange(parseFloat(detailData?.soil_moisture_id?.value || 0))
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {detailData?.soil_moisture_id?.value || "ไม่มีข้อมูล"} %
                                        </span>
                                    </p>
                                    <p className="mt-2">
                                        คำแนะนำ: {getMoistureAdvice(parseFloat(detailData?.soil_moisture_id?.value || 0))}
                                    </p>
                                </div>
                                <img src="/moisIcon.png" alt="Soil Moisture Icon" className="w-fit h-fit cursor-pointer" />
                            </div>
                        </div>

                        {/* Disease Detection Section */}
                        <div className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-2 w-8/12 mb-5">
                                    <p className="text-2xl font-bold">การเกิดโรค</p>
                                    <p>ตรวจสอบการเกิดโรค 4 โรค ได้แก่ โรคใบเหลือง โรคใบม้วน โรคใบจุดตากบ และแมลงหวี่ขาว</p>
                                    <p className="my-5">
                                        โรคที่พบ:{" "}
                                        <span
                                            className={`text-3xl font-semibold ${
                                                detailData?.diseasePredict_id?.DiseaseName
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {detailData?.diseasePredict_id?.DiseaseName || "ไม่มีข้อมูล"}
                                        </span>
                                    </p>
                                </div>
                                <img src="/diseaseIcon.png" alt="Disease Icon" className="w-fit h-fit cursor-pointer" />
                            </div>
                            <p>คำแนะนำ : ต้องดึงมา</p>
                            <div className="flex justify-end mt-2">
                                <Button
                                onClick={handleOpenPopup}
                                className='my-2 px-5 bg-gray-100 hover:bg-gray-200'    
                                >ดูประวัติย้อนหลัง
                                </Button>
                            </div>
                        </div>

                        {/* NPK Section */}
                        <div className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                            <div className="flex justify-between w-full">
                                
                                <div className="flex flex-col w-full lg:w-10/12">
                                    <p className="text-2xl font-bold mb-2">ธาตุอาหารหลัก NPK</p>
                                    
                                    <div className="flex flex-col gap-5 lg:flex-row mt-5 ">

                                        {/* ค่าไนโตรเจน */}
                                        <div className="flex flex-col w-full lg:w-4/12">
                                            <p className="font-bold">ค่าไนโตรเจน (N)</p>
                                            <p>ควรอยู่ระหว่าง 50 – 200 มก./ล.</p>

                                            <p className="my-5">
                                                ค่าปัจจุบัน : 
                                                <span
                                                    className={`text-3xl font-semibold ml-10 ${
                                                        isNitrogenOutOfRange(detailData?.nitrogen_id?.value)
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    {detailData?.nitrogen_id?.value} มก./ล.
                                                </span>
                                            </p>

                                            <p className="mt-2">
                                                คำแนะนำ : {getNitrogenAdvice(detailData?.nitrogen_id?.value)}
                                            </p>
                                        </div>


                                        {/* ค่าฟอสฟอรัส */}
                                        <div className="flex flex-col w-full lg:w-4/12">
                                            <p className="font-bold">ค่าฟอสฟอรัส (P)</p>
                                            <p>ควรอยู่ระหว่าง 4 – 14 มก./ล.</p>
                                            
                                            <p className="my-5">
                                                ค่าปัจจุบัน : 
                                                <span
                                                    className={`text-3xl font-semibold ml-10 ${
                                                        isPhosphorusOutOfRange(detailData?.phosphorus_id?.value)
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    {detailData?.phosphorus_id?.value} มก./ล.
                                                </span>
                                            </p>

                                            <p className="mt-2">
                                                คำแนะนำ : {getPhosphorusAdvice(detailData?.phosphorus_id?.value)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col w-full lg:w-4/12">
                                            <p className="font-bold">ค่าโพแทสเซียม (K)</p>
                                            <p>ควรอยู่ระหว่าง 50 – 200 มก./ล.</p>

                                            <p className="my-5">
                                                ค่าปัจจุบัน : 
                                                <span
                                                    className={`text-3xl font-semibold ml-10 ${
                                                        isPotassiumOutOfRange(detailData?.potassium_id?.value)
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    {detailData?.potassium_id?.value} มก./ล.
                                                </span>
                                            </p>

                                            <p className="mt-2">
                                                คำแนะนำ : {getPotassiumAdvice(detailData?.potassium_id?.value)}
                                            </p>
                                        </div>

                                    </div>
                                    
                                </div>
                                

                                <img src="/npkIcon.png" alt="Moisture Icon" className="w-fit h-fit cursor-pointer lg:self-center" />
                            </div>
                            
                        </div> 
                        
                    </div>
                </div>
            </div>

            <PopupDisease isOpen={isPopupOpen} onClose={handleClosePopup}>
                <p>ประวัติย้อนหลัง</p>
            </PopupDisease>
        </div>
    );
};

export default Detail;
