const schedule = require('node-schedule');
const Vehicle = require('../models/Vehicle');
const VehicleLocation = require('../models/vehicletrack');

// Function to generate random coordinates in Bangalore
function getRandomLocation() {
    const minLat = 12.8, maxLat = 13.1;
    const minLng = 77.5, maxLng = 77.7;

    return {
        latitude: (Math.random() * (maxLat - minLat) + minLat).toFixed(6),
        longitude: (Math.random() * (maxLng - minLng) + minLng).toFixed(6)
    };
}

// Function to update vehicle locations
async function updateVehicleLocations() {
    try {
        const trackingVehicles = await Vehicle.find({ tracking: true });

        for (const vehicle of trackingVehicles) {
            const { latitude, longitude } = getRandomLocation();

            const location = new VehicleLocation({
                vehicle: vehicle._id,
                latitude,
                longitude,
                speed: Math.floor(Math.random() * 60)
            });

            await location.save();
            console.log(`Updated location for ${vehicle.vehicle_num}:`, location);
        }
    } catch (error) {
        console.error('Error updating vehicle locations:', error);
    }
}

// ✅ Schedule a job to run the update every second
function startTrackingService() {
    schedule.scheduleJob('*/10 * * * * *', updateVehicleLocations);
    console.log('✅ Vehicle tracking service started...');
}

// Export functions
module.exports = {
    startTrackingService
};
