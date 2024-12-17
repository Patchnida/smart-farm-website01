import { useState, useEffect } from "react";
import Link from "next/link";
import {
    isTempOutOfRange,
    isHumidOutOfRange,
    isMoistureOutOfRange,
    isDiseaseDetected,
    isNitrogenOutOfRange,
    isPhosphorusOutOfRange,
    isPotassiumOutOfRange,
} from "@/utils/validation";
import PopupAddID from "./popUpAddID";
import PopUpDelete from "./popUpDelete";

import { axiosInstance } from "@/lib/axiosInstance";

const transformData = (data) => {
    return data.map((item, index) => ({
        id: item._id,
        transID: String(index + 1).padStart(4, "0"), 
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

function Table({ onClose }) {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const [newEntry, setNewEntry] = useState({
        id: "",
        transID: "",
        temp: 0,
        humid: 0,
        moisture: 0,
        disease: "ไม่พบ",
        npk: {
            nitrogen: 0,
            phosphorus: 0,
            potassium: 0,
        },
    });
    

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get("/api/getByLogger");
            const transformedData = transformData(response.data);
            setData(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const searchedRows = data.filter((row) =>
        row.id.toString().startsWith(searchTerm)
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = searchedRows.slice(indexOfFirstRow, indexOfLastRow);

    const nextPage = () => {
        if (indexOfLastRow < searchedRows.length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Save button clicked");
    
        try {
            const validEntry = {
                temperature_id: { value: newEntry.temp },
                air_humidity_id: { value: newEntry.humid },
                soil_moisture_id: { value: newEntry.moisture },
                nitrogen_id: { value: newEntry.npk.nitrogen },
                phosphorus_id: { value: newEntry.npk.phosphorus },
                potassium_id: { value: newEntry.npk.potassium },
                disease: newEntry.disease,
                date: new Date().toISOString(),
            };
    
            console.log("Payload:", validEntry);
            const response = await axiosInstance.post("/api/addLogger", validEntry);
    
            console.log("API Response:", response.data);
    
            if (response && response.data) {
                setData((prevData) => [...prevData, response.data]);
                setIsPopUpOpen(false);
            }
        } catch (error) {
            console.error("Error saving data:", error.response?.data || error.message);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEntry((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">ข้อมูล IoT</h2>
                <div className="flex gap-5">
                    <input
                        type="text"
                        placeholder="ค้นหาด้วย ID"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
                        onClick={() => setIsPopUpOpen(true)} 
                    >
                            เพิ่ม ID ใหม่
                    </button>
                </div>
            </div>

            {data.length === 0 ? (
                <div className="text-center mt-10 text-gray-500">No data available.</div>
            ) : (
                <table className="w-full bg-white border border-gray-200 text-center">
                    <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                            <th className="py-3 px-4 font-semibold text-gray-600">ID</th>
                            <th className="py-3 px-4 font-semibold text-gray-600">อุณหภูมิ (Temp)</th>
                            <th className="py-3 px-4 font-semibold text-gray-600">ความชื้นในอากาศ (Humid)</th>
                            <th className="py-3 px-4 font-semibold text-gray-600">ความชื้นในดิน (Moisture)</th>
                            <th className="py-3 px-4 font-semibold text-gray-600">ความเสี่ยงในการเกิดโรค</th>
                            <th className="py-3 px-4 font-semibold text-gray-600">
                                <p>ธาตุอาหารหลัก npk</p>
                                ค่าไนโตรเจน (N)
                            </th>
                            <th className="py-3 px-4 font-semibold text-gray-600">
                                <p>ธาตุอาหารหลัก npk</p>
                                ค่าฟอสฟอรัส (P)
                            </th>
                            <th className="py-3 px-4 font-semibold text-gray-600">
                                <p>ธาตุอาหารหลัก npk</p>
                                ค่าโพแทสเซียม (K)
                            </th>
                            <th className="py-3 px-4 font-semibold text-gray-600"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((row) => (
                            <tr key={row.id} className="border-b border-gray-200">
                                <td className="py-3 px-4 text-gray-700">
                                <Link href={{ pathname: `/detail/${row.id}`, query: { transID: row.transID } }}>
                                    {row.transID}
                                </Link>
                                </td>

                                <td
                                    className={`py-3 px-4 ${
                                        isTempOutOfRange(parseFloat(row.temp))
                                            ? "text-red-500 font-semibold"
                                            : "text-green-500 font-semibold"
                                    }`}
                                >
                                    {row.temp} °C
                                </td>

                                <td
                                    className={`py-3 px-4 ${
                                        isHumidOutOfRange(parseFloat(row.humid))
                                            ? "text-red-500 font-semibold"
                                            : "text-green-500 font-semibold"
                                    }`}
                                >
                                    {row.humid} %
                                </td>

                                <td
                                    className={`py-3 px-4 ${
                                        isMoistureOutOfRange(parseFloat(row.moisture))
                                            ? "text-red-500 font-semibold"
                                            : "text-green-500 font-semibold"
                                    }`}
                                >
                                    {row.moisture} %
                                </td>

                                <td
                                    className={`py-3 px-4 ${
                                        isDiseaseDetected(row.disease)
                                            ? "text-red-500 font-semibold"
                                            : "text-green-500 font-semibold"
                                    }`}
                                >
                                    {row.disease}
                                </td>

                                <td
                                    className={`py-3 px-4 ${
                                        isNitrogenOutOfRange(row.npk.nitrogen)
                                            ? "text-red-500 font-semibold"
                                            : "text-green-500 font-semibold"
                                    }`}
                                >
                                    {row.npk.nitrogen} มก./ล.
                                </td>

                                <td
                                    className={`py-3 px-4 ${
                                        isPhosphorusOutOfRange(row.npk.phosphorus)
                                            ? "text-red-500 font-semibold"
                                            : "text-green-500 font-semibold"
                                    }`}
                                >
                                    {row.npk.phosphorus} มก./ล.
                                </td>

                                <td
                                    className={`py-3 px-4 ${
                                        isPotassiumOutOfRange(row.npk.potassium)
                                            ? "text-red-500 font-semibold"
                                            : "text-green-500 font-semibold"
                                    }`}
                                >
                                    {row.npk.potassium} มก./ล.
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {searchedRows.length > rowsPerPage && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={prevPage}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        disabled={currentPage === 1}
                    >
                        หน้าก่อนหน้า
                    </button>
                    <span className="text-gray-700">หน้าที่ {currentPage}</span>
                    <button
                        onClick={nextPage}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                        disabled={indexOfLastRow >= searchedRows.length}
                    >
                        หน้าถัดไป
                    </button>
                </div>
            )}

            <PopupAddID 
                isOpen={isPopUpOpen} 
                onClose={() => setIsPopUpOpen(false)} 
                onSave={handleSave}
            >
                <input
                    name="id"
                    type="text"
                    placeholder="เพิ่ม ID ใหม่"
                    value={newEntry.id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
                />
            </PopupAddID>
        </div>
    );
}

export default Table;
