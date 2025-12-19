async function HandleDisplayUserDashboard(req, res) {
    try {
        // Fetch products from database (optional)
        // const products = await Product.find({}).limit(10); // latest 10 products

        // Define brands
        const brands = [
    { _id: 1, name: "Raymond", slug: "raymond", coverImage: "/images/raymond.jpg", colorTone: "#f5f5f5" },
    { _id: 2, name: "Louis philippe", slug: "louisphilippe", coverImage: "/images/louis-philippe.jpg", colorTone: "#e0e0e0" },
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

module.exports = HandleDisplayUserDashboard;