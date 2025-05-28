
const jwt = require("jsonwebtoken");
const multer = require('multer');

const S_key = "vaish"; 

const userTokenVerification = (req, res, next) => {
    const token = req.body.token || req.headers['authorization'];
    if (token) {
        try {
            jwt.verify(token, S_key);
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid Token", error: error.message });
        }
    } else {
        return res.status(401).json({ message: "Token missing" });
    }
};

const upload_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload");  
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop().toLowerCase();
        const allowedExtensions = ['png', 'jpg', 'jpeg'];
        if (allowedExtensions.includes(ext)) {
            cb(null, Date.now() + '-' + file.originalname);
        } else {
            cb(new Error("Only png, jpg and jpeg images are allowed"), null);
        }
    },
});

const upload1 = multer({ storage: upload_storage });

module.exports = { userTokenVerification, upload1 };
