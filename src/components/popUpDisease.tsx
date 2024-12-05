import React, { useState } from "react";
import { ReactNode } from "react";

interface PopUpProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function PopupDisease({ isOpen, onClose, children }: PopUpProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 w-full h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 lg:w-7/12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">ดูประวัติย้อนหลัง</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}

export default PopupDisease;
