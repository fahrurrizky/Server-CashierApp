const db = require('../../models');
const User = db.User;
const fs = require('fs')

const uploadImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const oldPic = await User.findOne({ where: { id: userId } });
        let updateImg = {}
        if(req.file && req.file.path) {
            updateImg = { imgProfile: req.file.path }
        }
        if(oldPic.imgProfile && fs.existsSync(oldPic.imgProfile)) {
            await fs.unlink(oldPic.imgProfile, (err) => {
                if (err) return res.status(500).json({
                    message: "Ada kesalahan",
                    error: err.message
                });
            });
        }
        await db.sequelize.transaction(async (t) => {
            const result = await User.update(
                updateImg,
                { where: { id: userId } }, // Menggunakan ID pengguna yang sudah diambil
                { transaction: t }
            );
            const user = await User.findByPk(userId);
            return res.status(200).json({ message: "Berhasil", result, user });
        });
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    uploadImage
}
