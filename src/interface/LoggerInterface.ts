export interface LoggerInterface {
    _id: string;
    iot_id: string;
    time: string | Date;
    date: Date;
    temperature_id: number;
    air_humidity_id: number;
    soil_moisture_id: number;
    nitrogen_id: number;
    phosphorus_id: number;
    potassium_id: number;
    diseasePredict_id: string;
}
