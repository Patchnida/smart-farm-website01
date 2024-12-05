import { ReactNode } from "react";

interface PopUpProps {
    isOpen: boolean;
    onClose: () => void;
    Confirm: () => void;
    id: string | null; 
    children?: ReactNode;
}

function PopUpDelete({ isOpen, onClose, Confirm, id }: PopUpProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">ลบ ID {id}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
                </div>
                <div className="mb-4">
                    <p>คุณต้องการที่จะลบ ID {id} ใช่หรือไม่?</p>
                </div>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        ยกเลิก
                    </button>
                    <button 
                        onClick={Confirm} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PopUpDelete;
