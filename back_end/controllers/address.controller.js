import Address from "../models/address.model.js";

// Create Address
export const createAddress = async (req, res) => {
    try {
        const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;

        if (!fullName || !phone || !line1 || !city || !state || !pincode) {
            return res.status(400).json({ message: "Please fill all required address fields." });
        }

        // A user's very first address always becomes their default —
        // otherwise respect whatever the client asked for.
        const existingCount = await Address.countDocuments({ user: req.userId });
        const shouldBeDefault = existingCount === 0 ? true : !!isDefault;

        // Only one address can be default at a time — unset any existing
        // one before this new one claims that spot.
        if (shouldBeDefault) {
            await Address.updateMany({ user: req.userId }, { isDefault: false });
        }

        const address = await Address.create({
            user: req.userId,
            label,
            fullName,
            phone,
            line1,
            line2,
            city,
            state,
            pincode,
            isDefault: shouldBeDefault
        });

        return res.status(201).json({ message: "Address Added Successfully.", address });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Get All Addresses For Logged In User
export const getUserAddresses = async (req, res) => {
    try {
        // Default address surfaces first, then newest-first among the rest
        const addresses = await Address.find({ user: req.userId })
            .sort({ isDefault: -1, createdAt: -1 });

        return res.status(200).json({ addresses });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Update Address
export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address Not Found." });
        }

        if (address.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized Access." });
        }

        const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;

        // If this edit is making it the default, unset any other default first
        if (isDefault) {
            await Address.updateMany({ user: req.userId }, { isDefault: false });
        }

        const updated = await Address.findByIdAndUpdate(
            req.params.id,
            { label, fullName, phone, line1, line2, city, state, pincode, isDefault },
            { returnDocument: 'after' }
        );

        return res.status(200).json({ message: "Address Updated Successfully.", address: updated });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Delete Address
export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address Not Found." });
        }

        if (address.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized Access." });
        }

        const wasDefault = address.isDefault;

        await Address.findByIdAndDelete(req.params.id);

        // If the deleted address was the default, promote the most recently
        // added remaining one — so a user with at least one address always
        // has exactly one default, never zero.
        if (wasDefault) {
            const nextAddress = await Address.findOne({ user: req.userId }).sort({ createdAt: -1 });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        return res.status(200).json({ message: "Address Deleted Successfully." });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Set Default Address
export const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: "Address Not Found." });
        }

        if (address.user.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized Access." });
        }

        await Address.updateMany({ user: req.userId }, { isDefault: false });
        address.isDefault = true;
        await address.save();

        return res.status(200).json({ message: "Default Address Updated.", address });

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
};