import { useState, useEffect } from "react";
import PopupAddID from "./popUpAddID";
import PopUpDelete from "./popUpDelete";
import Link from "next/link";
import { initialData } from "@/app/eachIdData";
import {
    isTempOutOfRange,
    isHumidOutOfRange,
    isMoistureOutOfRange,
    isDiseaseDetected,
    isNitrogenOutOfRange,
    isPhosphorusOutOfRange,
    isPotassiumOutOfRange,
} from "@/utils/validation";

const flattenData = (data: typeof initialData, selectedTime: string) => {
    const selectedEntry = data.find((entry) => entry.time === selectedTime);
    if (!selectedEntry) return [];
    return selectedEntry.detail.map((item) => ({
        ...item,
        temp: parseFloat(item.temp.replace("°C", "")),
        humid: parseFloat(item.humid.replace("%", "")),
        moisture: parseFloat(item.moisture.replace("%", "")),
    }));
};

function Table({
    selectedTime,
    setSelectedTime,
}: {
    selectedTime: string;
    setSelectedTime: (time: string) => void;
}) {
    const [data, setData] = useState(initialData);
    const [filteredData, setFilteredData] = useState(flattenData(initialData, selectedTime));
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [isDeletePopUpOpen, setIsDeletePopUpOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const [newEntry, setNewEntry] = useState({
        id: "",
        temp: "",
        humid: "",
        moisture: "",
        disease: "",
    });

    // Update filteredData whenever selectedTime changes
    useEffect(() => {
        setFilteredData(flattenData(data, selectedTime));
    }, [selectedTime, data]);

    // Filter rows based on search term
    const searchedRows = filteredData.filter((row) =>
        row.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = searchedRows.slice(indexOfFirstRow, indexOfLastRow);

    const nextPage = () => {
        if (indexOfLastRow < searchedRows.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleSave = () => {
        setData((prevData) => {
            const updatedData = [...prevData];
            const entryIndex = updatedData.findIndex((entry) => entry.time === selectedTime);
            if (entryIndex >= 0) {
                updatedData[entryIndex].detail = [...updatedData[entryIndex].detail, newEntry];
            }
            return updatedData;
        });
        setNewEntry({ id: "", temp: "", humid: "", moisture: "", disease: "" });
        setIsPopUpOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewEntry((prev) => ({ ...prev, [name]: value }));
    };

    const openDeletePopup = (id: string) => {
        setIdToDelete(id);
        setIsDeletePopUpOpen(true);
    };

    const handleConfirmDelete = () => {
        if (idToDelete) {
            setData((prevData) => {
                const updatedData = [...prevData];
                const entryIndex = updatedData.findIndex((entry) => entry.time === selectedTime);
                if (entryIndex >= 0) {
                    updatedData[entryIndex].detail = updatedData[entryIndex].detail.filter(
                        (row) => row.id !== idToDelete
                    );
                }
                return updatedData;
            });
            setIdToDelete(null);
        }
        setIsDeletePopUpOpen(false);
    };

    const handleCancelDelete = () => {
        setIdToDelete(null);
        setIsDeletePopUpOpen(false);
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">พริกทั้งหมด</h2>
                <div className="flex space-x-2">
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
            <table className="w-full bg-white border border-gray-200 text-center">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="py-3 px-4 font-semibold text-gray-600">ID</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">อุณหภูมิ</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">ความชื้นในอากาศ</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">ความชื้นในดิน</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">ความเสี่ยงในการเกิดโรค</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((row) => (
                        <tr key={row.id} className="border-b border-gray-200">
                            <td className="py-3 px-4 text-gray-700">
                                <Link href={`/detail/${row.id}`}>{row.id}</Link>
                            </td>
                            <td
                                className={`py-3 px-4 ${
                                    isTempOutOfRange(row.temp)
                                        ? "text-red-500 font-semibold"
                                        : "text-green-500 font-semibold"
                                }`}
                            >
                                {row.temp} °C
                            </td>
                            <td
                                className={`py-3 px-4 ${
                                    isHumidOutOfRange(row.humid)
                                        ? "text-red-500 font-semibold"
                                        : "text-green-500 font-semibold"
                                }`}
                            >
                                {row.humid} %
                            </td>
                            <td
                                className={`py-3 px-4 ${
                                    isMoistureOutOfRange(row.moisture)
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
                        </tr>
                    ))}
                </tbody>
            </table>

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

            <PopupAddID isOpen={isPopUpOpen} onClose={() => setIsPopUpOpen(false)} onSave={handleSave}>
                <input
                    name="id"
                    type="text"
                    placeholder="เพิ่ม ID ใหม่"
                    value={newEntry.id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
                />
            </PopupAddID>

            <PopUpDelete
                isOpen={isDeletePopUpOpen}
                onClose={handleCancelDelete}
                Confirm={handleConfirmDelete}
                id={idToDelete}
            />
        </div>
    );
}

export default Table;
