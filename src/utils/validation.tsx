export const isTempOutOfRange = (temp: number): boolean => temp < 20 || temp > 30;

export const getTempAdvice = (temp: number): string => {
    if (temp < 20) return "ควรเพิ่มอุณหภูมิ"
    else if (temp > 30) return "ควรลดอุณหภูมิ";
    else return "ไม่มี";
};

export const isHumidOutOfRange = (humid: number): boolean => humid < 60 || humid > 80;

export const getHumidAdvice = (humid: number): string => {
    if (humid < 60) return "ควรเพิ่มความชื้นในอากาศ";
    else if (humid > 80) return "ควรลดความชื้นในอากาศ";
    else return "ไม่มี";
};

export const isMoistureOutOfRange = (moisture: number): boolean => moisture < 60 || moisture > 70;

export const getMoistureAdvice = (moisture: number): string => {
    if (moisture < 60) return "ควรเพิ่มความชื้นในดิน";
    else if (moisture > 70) return "ควรลดความชื้นในดิน";
    else return "ไม่มี";
};

export const isDiseaseDetected = (disease: any): boolean => {
    if (typeof disease === "string") {
        return disease.startsWith("เป็นโรค");
    }
    return false;
};

export const isNitrogenOutOfRange = (nitrogen: number): boolean => nitrogen < 50 || nitrogen > 200;

export const getNitrogenAdvice = (nitrogen: number): string => {
    if (nitrogen < 50) return "ควรเพิ่มปริมาณไนโตรเจนในดิน";
    else if (nitrogen > 200) return "ควรลดปริมาณไนโตรเจนในดิน";
    else return "ไม่มี";
};

export const isPhosphorusOutOfRange = (phosphorus: number): boolean => phosphorus < 4 || phosphorus > 14;

export const getPhosphorusAdvice = (phosphorus: number): string => {
    if (phosphorus < 4) return "ควรเพิ่มปริมาณฟอสฟอรัสในดิน";
    else if (phosphorus > 14) return "ควรลดปริมาณฟอสฟอรัสในดิน";
    else return "ไม่มี";
};

export const isPotassiumOutOfRange = (potassium: number): boolean => potassium < 50 || potassium > 200;

export const getPotassiumAdvice = (potassium: number): string => {
    if (potassium < 50) return "ควรเพิ่มปริมาณโพแทสเซียมในดิน";
    else if (potassium > 200) return "ควรลดปริมาณโพแทสเซียมในดิน";
    else return "ไม่มี";
};
