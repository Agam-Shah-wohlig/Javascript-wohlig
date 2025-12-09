
function HandleDisplayDashboard(req, res) {
    try {
        return res.render("admin-dashboard");
    } catch (err) {
        return res.status(500).json({
            message: "Server Not Responding"
        });
    }
}

module.exports = {
    HandleDisplayDashboard
}