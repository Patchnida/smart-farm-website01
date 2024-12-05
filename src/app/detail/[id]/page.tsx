'use client';

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDate } from "@/utils/DataContext";
import { initialData } from "@/app/eachIdData";
import Link from "next/link";
import Button from '@mui/material/Button';

import PopupDisease from "@/components/popUpDisease";
import { historyData } from './../../eachIdData';
import { isTempOutOfRange,
    getTempAdvice,
    isHumidOutOfRange,
    isMoistureOutOfRange,
    isDiseaseDetected,
    isNitrogenOutOfRange,
    isPhosphorusOutOfRange,
    isPotassiumOutOfRange,
    getHumidAdvice,
    getMoistureAdvice,
    getNitrogenAdvice,
    getPhosphorusAdvice,
    getPotassiumAdvice, } from "@/utils/validation";

const Detail: React.FC = () => {
    const { id } = useParams();
    const { selectedTime } = useDate(); // Access selectedTime from context
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchDate, setSearchDate] = useState("");

    if (!id || !initialData[0]) return <p>ข้อมูลไม่พบสำหรับ ID นี้</p>;

    const detailData = initialData[0].detail.find(detail => detail.id === id);

    if (!detailData) {
        return <p>ข้อมูลไม่พบสำหรับ ID นี้</p>;
    }

    const formatDateToThai = (dateString: string): string => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid date";

        const dayNames = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
        const monthNames = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const dayName = dayNames[date.getDay()];
        const day = date.getDate();
        const monthName = monthNames[date.getMonth()];
        const buddhistYear = date.getFullYear() + 543;

        return `${dayName}ที่ ${day} ${monthName} ${buddhistYear}`;
    };

    const handleOpenPopup = () => setIsPopupOpen(true);
    const handleClosePopup = () => setIsPopupOpen(false);

    const currentHistory = historyData.find(data => data.id === id)?.history || [];

    const filteredHistory = currentHistory.filter(record => 
        formatDateToThai(record.date).includes(searchDate)
    );

    return (
        <div className="grid grid-rows-[20px_1fr_20px] h-full">      
            <div className="flex flex-col w-full h-fit items-center">
                <div className="w-11/12 h-5/6 mt-5 p-10 bg-white rounded-lg shadow-sm">
                   <div className="flex flex-col gap-2 mb-5">
                        <p className="text-3xl font-bold">
                            {formatDateToThai(initialData[0].date)}
                        </p>
                        <p className="text-2xl font-medium text-sky-700">
                            เวลา {selectedTime} น.
                        </p>
                        </div>
                            <p className="font-semibold text-lg mt-2">ID {detailData.id}</p>

                            <div className="flex flex-wrap gap-5 mt-5 h-full">
                                {/* อุณหภูมิในดิน */}
                                <div className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-2">
                                            <p className="text-2xl font-bold">อุณหภูมิในดิน</p>
                                            <p>ควรอยู่ระหว่าง 20-30 °C</p>
                                            <p className="my-5">
                                                ค่าปัจจุบัน : 
                                                <span
                                                    className={`text-3xl font-semibold ml-10 ${
                                                        isTempOutOfRange(parseFloat(detailData.temp))
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    {detailData.temp} °C
                                                </span>
                                            </p>
                                            <p className="mt-2">
                                                คำแนะนำ : {getTempAdvice(parseFloat(detailData.temp))}
                                            </p>
                                        </div>
                                        <img src="/temIcon.png" alt="Temperature Icon" className="w-fit h-fit cursor-pointer" />
                                    </div>
                                
                                </div>

                        {/* ความชื้นในอากาศ */}
                        <div
                         className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-2">
                                    <p className="text-2xl font-bold">ความชื้นในอากาศ</p>
                                    <p>ควรอยู่ระหว่าง 60-80 %</p>
                                    <p className="my-5">
                                        ค่าปัจจุบัน : 
                                            <span
                                                className={`text-3xl font-semibold ml-10 ${
                                                    isHumidOutOfRange(parseFloat(detailData.humid))
                                                        ? "text-red-500"
                                                        : "text-green-500"
                                                }`}
                                            >
                                                {detailData.humid} %
                                            </span>
                                    </p>
                                    <p className="mt-2">
                                        คำแนะนำ : {getHumidAdvice(parseFloat(detailData.humid))}
                                    </p>
                                </div>
                                <img src="/humidIcon.png" alt="Humid Icon" className="w-fit h-fit cursor-pointer" />
                            </div>
                        </div>

                        {/* ความชื้นในดิน */}
                        <div
                         className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-2">
                                <p className="text-2xl font-bold">ความชื้นในดิน</p>
                                <p>ควรอยู่ระหว่าง 60-70 %</p>
                                <p className="my-5">
                                    ค่าปัจจุบัน : 
                                        <span
                                            className={`text-3xl font-semibold ml-10 ${
                                                isMoistureOutOfRange(parseFloat(detailData.moisture))
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {detailData.moisture} %
                                        </span>
                                </p>
                                <p className="mt-2">
                                    คำแนะนำ : {getMoistureAdvice(parseFloat(detailData.moisture))}
                                </p>
                                </div>
                                <img src="/moisIcon.png" alt="Moisture Icon" className="w-fit h-fit cursor-pointer" />
                            </div>
                        </div>

                        {/* ความเสี่ยงในการเป็นโรค */}
                        <div
                         className="flex flex-col w-full md:w-[48%] bg-white border border-gray-200 rounded-lg shadow-md p-10 text-lg flex-grow min-h-[250px]">
                            <div className="flex justify-between w-full">
                                <div className="flex flex-col gap-2 w-8/12 mb-5">
                                    <p className="text-2xl font-bold">การเกิดโรค</p>
                                    <p>ตรวจสอบการเกิดโรค 4 โรค ได้แก่ โรคใบเหลือง โรคใบม้วน โรคใบจุดตากบ และแมลงหวี่ขาว</p>
                                    <div className="flex justify-center items-center my-5">
                                        <span
                                            className={`text-3xl font-semibold text-center ${
                                                isDiseaseDetected(detailData.disease)
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {detailData.disease}
                                        </span>
                                    </div>
                                </div>
                                <img src="/diseaseIcon.png" alt="Disease Icon" className="w-fit h-fit cursor-pointer" />
                            </div>
                            <p>คำแนะนำ : ใช้สารประเภทคลอโรธาโรนิล (chlorothalonil) ฉีด พ่นสม่าเสมอขณะระบาด จะได้ผลดี</p>
                            <div className="flex justify-end mt-2">
                                <Button
                                onClick={handleOpenPopup}
                                className='my-2 px-5 bg-gray-100 hover:bg-gray-200'    
                                >ดูประวัติย้อนหลัง
                                </Button>
                            </div>
                        </div>

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
                                                        isNitrogenOutOfRange(detailData.npk.nitrogen)
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    {detailData.npk.nitrogen} มก./ล.
                                                </span>
                                            </p>

                                            <p className="mt-2">
                                                คำแนะนำ : {getNitrogenAdvice(detailData.npk.nitrogen)}
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
                                                        isPhosphorusOutOfRange(detailData.npk.phosphorus)
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    {detailData.npk.phosphorus} มก./ล.
                                                </span>
                                            </p>

                                            <p className="mt-2">
                                                คำแนะนำ : {getPhosphorusAdvice(detailData.npk.phosphorus)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col w-full lg:w-4/12">
                                            <p className="font-bold">ค่าโพแทสเซียม (K)</p>
                                            <p>ควรอยู่ระหว่าง 50 – 200 มก./ล.</p>

                                            <p className="my-5">
                                                ค่าปัจจุบัน : 
                                                <span
                                                    className={`text-3xl font-semibold ml-10 ${
                                                        isPotassiumOutOfRange(detailData.npk.potassium)
                                                            ? "text-red-500"
                                                            : "text-green-500"
                                                    }`}
                                                >
                                                    {detailData.npk.potassium} มก./ล.
                                                </span>
                                            </p>

                                            <p className="mt-2">
                                                คำแนะนำ : {getPotassiumAdvice(detailData.npk.potassium)}
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
                <div className="flex flex-col max-h-96 overflow-y-auto">
                    <div className="mb-4">
                        <input
                            type="text"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            placeholder="Search by Date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
                        />
                    </div>
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((record, index) => (
                            <div key={index} className="flex justify-between border gap-5 p-5">
                                <div className="w-6/12 h-full">
                                    <p className="mb-2 text-2xl font-semibold">{formatDateToThai(record.date)}</p>
                                    <p className="mb-2 text-sky-700">เวลา {record.time} น.</p>
                                    <div className="w-full h-full mb-2 py-10">
                                        <p className={`${record.status === "ปกติ" ? "text-green-500" : "text-red-500"} text-center text-2xl font-semibold`}>
                                            {record.status}
                                        </p>
                                    </div>
                                    <p>คำแนะนำ : {record.recomment}</p>
                                </div>
                                <div className="w-6/12 h-full">
                                    <img src={record.image} alt="Disease image" className="w-full h-auto" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">ไม่มีข้อมูลประวัติย้อนหลัง</p>
                    )}
                </div>
            </PopupDisease>


        </div>
    );
}

export default Detail;
