export const isTempOutOfRange = (temp: number): boolean => temp < 24 || temp > 29;

export const getTempAdvice = (temp: number): string[] => {
    if (temp < 24) {
        return [
            "1. คลุมดิน: ใช้วัสดุคลุมดิน เช่น ฟางข้าว เพื่อรักษาความอบอุ่นในดิน",
            "2. ใช้พลาสติกใสคลุมดิน: คลุมแปลงปลูกด้วยพลาสติกใสเพื่อดักความร้อนในดิน",
            "3. ปรับเวลารดน้ำ: รดน้ำในช่วงเช้าเพื่อเพิ่มความชื้นโดยไม่ทำให้ดินเย็นเกินไป"
        ];
    } else if (temp > 29) {
        return [
            "1. ใช้วัสดุคลุมดินสีอ่อน: เช่น ฟางข้าวหรือพลาสติกสีขาว เพื่อสะท้อนแสงและลดการสะสมความร้อนในดิน",
            "2. รดน้ำในช่วงเย็นหรือเช้า: เพื่อช่วยลดอุณหภูมิในดินและเพิ่มความชื้นให้พืช",
            "3. ปลูกพืชคลุมดิน: เช่น หญ้าแฝก เพื่อช่วยลดความร้อนที่สะสมในดินและรักษาระดับความชื้น"
        ];
    } else {
        return ["ไม่มี"];
    }
};

export const isHumidOutOfRange = (humid: number): boolean => humid < 60 || humid > 80;

export const getHumidAdvice = (humid: number): string[] => {
    if (humid < 60) {
        return [
            "1. เพิ่มความชื้นในอากาศ: ใช้ระบบพ่นหมอกหรือสเปรย์น้ำในช่วงเช้าหรือเย็น เพื่อเพิ่มความชื้นในบริเวณปลูก",
            "2. คลุมดิน: ใช้วัสดุคลุมดิน เช่น ฟางข้าว เพื่อรักษาความชื้นในดินและลดการระเหย",
            "3. เพิ่มความถี่ในการรดน้ำ: รดน้ำบ่อยขึ้นในช่วงอากาศแห้ง เพื่อให้ดินมีความชื้นเพียงพอ"
        ];
    }
    if (humid > 80) {
        return [
            "1. ปรับระบายอากาศ: เพิ่มการระบายอากาศในพื้นที่ปลูก โดยเปิดเรือนปลูกหรือใช้พัดลม เพื่อหมุนเวียนอากาศและลดการสะสมความชื้น",
            "2. ลดความถี่การรดน้ำ: ลดปริมาณและความถี่ของการรดน้ำ เพื่อหลีกเลี่ยงดินที่ชื้นมากเกินไป ซึ่งอาจทำให้รากเน่า",
            "3. ใช้วัสดุคลุมดินที่ระบายอากาศได้ดี: เลือกวัสดุคลุมดินที่มีการระบายอากาศดี หลีกเลี่ยงวัสดุที่กักเก็บความชื้นสูงเกินไป"
        ];
    }
    return ["ไม่มี"];
};


export const isMoistureOutOfRange = (moisture: number): boolean => moisture < 24 || moisture > 80;

export const getMoistureAdvice = (moisture: number): string[] => {
    if (moisture < 24) {
        return [
            "ควรเพิ่มความถี่ในการรดน้ำ ใช้วัสดุคลุมดินเพื่อรักษาความชื้น และปลูกพืชคลุมดินเพื่อช่วยลดการระเหยของน้ำ",
        ];
    }
    if (moisture > 80) {
        return [
            "ควรปรับปรุงการระบายน้ำในดิน ลดความถี่ในการรดน้ำ หรือยกแปลงปลูกให้สูงขึ้นเพื่อลดการขังน้ำ ซึ่งจะช่วยลดโอกาสการเกิดโรครากเน่า",

        ];
    }
    return ["ไม่มี"];
};

export const isDiseaseDetected = (disease: any): boolean => {
    const detectableDiseases = ["leaf spot", "yellow leaf", "leaf curl", "whitefly"];
    if (typeof disease === "string") {
        return detectableDiseases.includes(disease.toLowerCase());
    }
    return false;
};


export const isNitrogenOutOfRange = (nitrogen: number): boolean => nitrogen < 50 || nitrogen > 200;

export const getNitrogenAdvice = (nitrogen: number): string => {
    if (nitrogen < 50) return "เมื่อพริกขาดไนโตรเจน ใบจะมีสีเหลืองซีดและการเจริญเติบโตจะช้าลง การใส่ปุ๋ยที่มีไนโตรเจนสูง เช่น ปุ๋ยยูเรีย (สูตร 46-0-0) จะช่วยเสริมไนโตรเจนให้กับพืช";
    else if (nitrogen > 200) return "ใบจะเติบโตเกินไปแต่ผลออกน้อย ควรลดปริมาณปุ๋ยที่มีไนโตรเจนสูงลง และปรับใช้ปุ๋ยอินทรีย์แทน เช่น ปุ๋ยคอกหรือปุ๋ยหมัก";
    else return "ไม่มี";
};

export const isPhosphorusOutOfRange = (phosphorus: number): boolean => phosphorus < 4 || phosphorus > 14;

export const getPhosphorusAdvice = (phosphorus: number): string => {
    if (phosphorus < 4) return "เมื่อขาดฟอสฟอรัส พริกจะมีการออกดอกและผลน้อยลง การใส่ปุ๋ยที่มีฟอสฟอรัสสูง เช่น ปุ๋ยสูตร 16-20-0 จะช่วยกระตุ้นการออกดอกและผล";
    else if (phosphorus > 14) return "ทำให้การดูดซึมธาตุอื่น ๆ เช่น สังกะสีและธาตุเหล็กลดลง แก้ไขโดยลดการใช้ปุ๋ยที่มีฟอสฟอรัสสูง และอาจเสริมด้วยการใช้ปุ๋ยที่มีสัดส่วนธาตุอาหารสมดุล";
    else return "ไม่มี";
};

export const isPotassiumOutOfRange = (potassium: number): boolean => potassium < 50 || potassium > 200;

export const getPotassiumAdvice = (potassium: number): string => {
    if (potassium < 50) return "เมื่อขาดโพแทสเซียม พริกจะมีผลที่ไม่สมบูรณ์และทนต่อโรคได้ไม่ดี ควรใส่ปุ๋ยที่มีโพแทสเซียมสูง เช่น ปุ๋ยสูตร 0-0-60 เพื่อช่วยเสริมสร้างผลที่แข็งแรง";
    else if (potassium > 200) return "ทำให้การดูดซึมธาตุในดินช้าลง ส่งผลให้พืชเจริญเติบโตไม่สมบูรณ์ ควรลดการใช้ปุ๋ยที่มีโพแทสเซียมสูง และปรับการใช้ปุ๋ยเสริมธาตุอาหารตามสูตรที่เหมาะสม";
    else return "ไม่มี";
};
