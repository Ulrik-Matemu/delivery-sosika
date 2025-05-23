import axios from "axios";

export interface Coordinates {
    x: number;
    y: number;
}

export const getUserLocation = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve({ x: latitude, y: longitude });
            },
            (error) => {
                reject(new Error(`Failed to retrieve location: ${error.message}`));
            }
        );
    });
};


export const updateLocation = async (entity_id: number, entity_type: string, latitude: number, longitude: number) => {
    try {
        const response = await axios.post('http://localhost:4000/api/location/update', {
            entity_id,
            entity_type,
            latitude,
            longitude
        });

        if (response.status === 200) {
            console.log("📍 Location updated successfully:", response.data);
        } else {
            console.error("❌ Failed to update location:", response.status, response.data);
        }
    } catch (error: any) {
        console.error("❌ Error while updating location:", error.message);
    }
};