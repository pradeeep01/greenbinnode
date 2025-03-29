const Vehicle = require('../../models/Vehicle');

// Create a new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const { vehicle_num, driver_name, name, status } = req.body;

        const newVehicle = new Vehicle({
            vehicle_num,
            driver_name,
            name,
            addedBy: req.user._id, // Assuming Passport.js adds `req.user`
            status: status || 'active'
        });

        await newVehicle.save();
        res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('addedBy', 'name email');
        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('addedBy', 'name email');
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
    try {
        const { vehicle_num, driver_name, name, status } = req.body;
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        vehicle.vehicle_num = vehicle_num || vehicle.vehicle_num;
        vehicle.driver_name = driver_name || vehicle.driver_name;
        vehicle.name = name || vehicle.name;
        vehicle.status = status || vehicle.status;

        await vehicle.save();
        res.json({ message: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        
        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
