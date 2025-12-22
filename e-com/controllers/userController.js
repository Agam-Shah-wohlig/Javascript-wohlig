async function HandleDisplayUserDashboard(req, res) {
    try {
        // Fetch products from database (optional)
        // const products = await Product.find({}).limit(10); // latest 10 products

        // Define brands
        const brands = [
    { _id: 1, name: "Raymond", slug: "raymond", coverImage: "/images/raymond.jpg", colorTone: "#f5f5f5" },
    { _id: 2, name: "Louis Philippe", slug: "louisphilippe", coverImage: "/images/louis-philippe.jpg", colorTone: "#e0e0e0" },
    { _id: 3, name: "Blackberrys", slug: "blackberrys", coverImage: "/images/blackberrys.jpg", colorTone: "#dcdcdc" }
];

        // Render homepage with brands and optional message
        return res.render("homepage", { 
            brands,   // this matches the EJS loop variable
            message: null
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Not Responding" });
    }
}

const User = require("../models/user");
const Address = require("../models/address");

// Display user profile page
async function HandleGetProfile(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        const user = await User.findById(req.user._id).lean();
        
        // Fetch all addresses for this user
        const addresses = await Address.find({ user: req.user._id }).lean();
        
        res.render("profile", { user, addresses });
    } catch (error) {
        console.error("Error loading profile:", error);
        res.status(500).send("Error loading profile");
    }
}

// Update personal details
async function HandleUpdateProfile(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        const { fullName, email, phone, dateOfBirth } = req.body;

        // Validate required fields
        if (!fullName || !email) {
            return res.status(400).send("Full name and email are required");
        }

        // Update user
        await User.findByIdAndUpdate(req.user._id, {
            fullName,
            email,
            phone,
            dateOfBirth: dateOfBirth || null
        });

        res.redirect('/user/profile');
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).send("Error updating profile");
    }
}

// Add new shipping address
async function HandleAddAddress(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        const { label, fullName, phone, street, city, state, postalCode, country } = req.body;

        // Validate required fields
        if (!label || !fullName || !phone || !street || !city || !state || !postalCode || !country) {
            return res.status(400).send("All address fields are required");
        }

        // Create new address
        await Address.create({
            user: req.user._id,
            label,
            fullName,
            phone,
            street,
            city,
            state,
            postalCode,
            country
        });

        res.redirect('/user/profile');
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).send("Error adding address");
    }
}

// Update existing shipping address
async function HandleUpdateAddress(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        const { addressId, label, fullName, phone, street, city, state, postalCode, country, next } = req.body;

        if (!addressId) {
            return res.status(400).send("Address ID is required");
        }

        // Validate required fields
        if (!label || !fullName || !phone || !street || !city || !state || !postalCode || !country) {
            return res.status(400).send("All address fields are required");
        }

        // Update address (only if it belongs to the current user)
        const result = await Address.findOneAndUpdate(
            { _id: addressId, user: req.user._id },
            {
                label,
                fullName,
                phone,
                street,
                city,
                state,
                postalCode,
                country
            }
        );

        if (!result) {
            return res.status(404).send("Address not found");
        }

        res.redirect(next ||'/user/profile');
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).send("Error updating address");
    }
}

// Delete shipping address
async function HandleDeleteAddress(req, res) {
    try {
        if (!req.user) {
            return res.redirect('/auth/login');
        }

        const { addressId } = req.params;

        // Delete address (only if it belongs to the current user)
        const result = await Address.findOneAndDelete({
            _id: addressId,
            user: req.user._id
        });

        if (!result) {
            return res.status(404).send("Address not found");
        }

        res.redirect('/user/profile');
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).send("Error deleting address");
    }
}


module.exports = {
    HandleDisplayUserDashboard,
    HandleGetProfile,
    HandleUpdateProfile,
    HandleAddAddress,
    HandleUpdateAddress,
    HandleDeleteAddress,
};