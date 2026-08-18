const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ============================================================
// UPLOAD DIRECTORY
// ============================================================

const uploadDirectory =
    path.join(
        __dirname,
        "../uploads/profiles"
    );

// Create directory if it doesn't exist

if (!fs.existsSync(uploadDirectory)) {

    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );

}

// ============================================================
// STORAGE
// ============================================================

const storage =
    multer.diskStorage({

        destination: function (
            req,
            file,
            cb
        ) {

            cb(
                null,
                uploadDirectory
            );

        },

        filename: function (
            req,
            file,
            cb
        ) {

            const extension =
                path.extname(
                    file.originalname
                );

            const filename =
                `buyer-profile-${req.user.id}-${Date.now()}${extension}`;

            cb(
                null,
                filename
            );

        }

    });

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter =
    function (
        req,
        file,
        cb
    ) {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed"
                ),
                false
            );

        }

    };

// ============================================================
// MULTER
// ============================================================

const upload =
    multer({

        storage,

        fileFilter,

        limits: {
            fileSize:
                5 * 1024 * 1024
        }

    });

module.exports = upload;