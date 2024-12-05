import React from 'react';
import {
    isTempOutOfRange,
    isHumidOutOfRange,
    isMoistureOutOfRange,
    isDiseaseDetected,
    isNitrogenOutOfRange,
    isPhosphorusOutOfRange,
    isPotassiumOutOfRange,
} from "@/utils/validation";

export const generateNotificationIcons = (data: {
    temp: number;
    humid: number;
    moisture: number;
    disease: string;
}) => {
    const icons = [];

    if (isTempOutOfRange(data.temp)) {
        icons.push({ src: "/temIcon.png", alt: "Temperature Out of Range" });
    }
    if (isHumidOutOfRange(data.humid)) {
        icons.push({ src: "/humidIcon.png", alt: "Humidity Out of Range" });
    }
    if (isMoistureOutOfRange(data.moisture)) {
        icons.push({ src: "/moisIcon.png", alt: "Moisture Out of Range" });
    }
    if (isDiseaseDetected(data.disease)) {
        icons.push({ src: "/diseaseIcon.png", alt: "Disease Detected" });
    }

    return icons;
};

// Default export (dummy component for compliance)
const IconPage = () => {
    return <div>Utility functions for generating notification icons.</div>;
};

export default IconPage;
