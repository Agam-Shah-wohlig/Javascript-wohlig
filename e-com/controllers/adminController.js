
function HandleDisplayAdminDashboard(req, res) {
    try {
        return res.render("adminPanel");
    } catch (err) {
        return res.status(500).json({
            message: "Server Not Responding"
        });
    }
}


module.exports = {
    HandleDisplayAdminDashboard
}