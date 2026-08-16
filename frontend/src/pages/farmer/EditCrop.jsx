import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FarmerLayout from "../../layouts/FarmerLayout";

import {
    getMyCrops,
    updateCrop
} from "../../services/cropService";


function EditCrop() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [form, setForm] = useState({
        crop_name: "",
        crop_variety: "",
        quantity: "",
        quantity_unit: "kg",
        quality: "",
        expected_price: "",
        harvest_date: "",
        description: "",
        status: "available"
    });


    const [oldImage, setOldImage] = useState("");

    const [image, setImage] = useState(null);

    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [message, setMessage] = useState("");


    // ==========================================
    // LOAD CROP
    // ==========================================

    useEffect(() => {

        const loadCrop = async () => {

            try {

                setLoading(true);

                const result =
                    await getMyCrops();


                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Failed to load crops."
                    );

                }


                const crop =
                    result.crops.find(
                        item =>
                            String(item.id) === String(id)
                    );


                if (!crop) {

                    throw new Error(
                        "Crop not found."
                    );

                }


                setForm({

                    crop_name:
                        crop.crop_name || "",

                    crop_variety:
                        crop.crop_variety || "",

                    quantity:
                        crop.quantity || "",

                    quantity_unit:
                        crop.quantity_unit || "kg",

                    quality:
                        crop.quality || "",

                    expected_price:
                        crop.expected_price || "",

                    harvest_date:
                        crop.harvest_date
                            ? String(
                                  crop.harvest_date
                              ).slice(0, 10)
                            : "",

                    description:
                        crop.description || "",

                    status:
                        crop.status || "available"

                });


                setOldImage(
                    crop.image || ""
                );


            } catch (err) {

                console.error(
                    "Load Crop Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load crop."
                );

            } finally {

                setLoading(false);

            }

        };


        loadCrop();

    }, [id]);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm(previous => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // HANDLE IMAGE
    // ==========================================

    const handleImage = (e) => {

        const file =
            e.target.files?.[0];


        if (!file) {
            return;
        }


        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];


        if (!allowedTypes.includes(file.type)) {

            setError(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            return;

        }


        if (file.size > 5 * 1024 * 1024) {

            setError(
                "Image must be less than 5 MB."
            );

            return;

        }


        setError("");

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );

    };


    // ==========================================
    // IMAGE URL
    // ==========================================

    const getImageUrl = (imagePath) => {

        if (!imagePath) {
            return "";
        }


        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {

            return imagePath;

        }


        return `${window.location.origin}${imagePath}`;

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        setError("");

        setMessage("");


        try {

            const formData =
                new FormData();


            formData.append(
                "crop_name",
                form.crop_name
            );

            formData.append(
                "crop_variety",
                form.crop_variety
            );

            formData.append(
                "quantity",
                form.quantity
            );

            formData.append(
                "quantity_unit",
                form.quantity_unit
            );

            formData.append(
                "quality",
                form.quality
            );

            formData.append(
                "expected_price",
                form.expected_price
            );

            formData.append(
                "harvest_date",
                form.harvest_date
            );

            formData.append(
                "description",
                form.description
            );

            formData.append(
                "status",
                form.status
            );


            // IMPORTANT:
            // Must match cropRoutes.js
            // cropUpload.single("image")

            if (image) {

                formData.append(
                    "image",
                    image
                );

            }


            const result =
                await updateCrop(
                    id,
                    formData
                );


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Failed to update crop."
                );

            }


            setMessage(
                "Crop updated successfully!"
            );


            setTimeout(() => {

                navigate("/farmer/crops");

            }, 800);


        } catch (err) {

            console.error(
                "Update Crop Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update crop."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <FarmerLayout>

                <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">

                    <div className="text-center">

                        <div className="w-10 h-10 border-4 border-gray-300 border-t-[#ff6500] rounded-full animate-spin mx-auto mb-4">
                        </div>

                        <p className="text-gray-600">
                            Loading crop...
                        </p>

                    </div>

                </div>

            </FarmerLayout>

        );

    }


    return (

        <FarmerLayout>

            <div className="min-h-screen bg-[#f3f4f6] py-10 px-5">

                <div className="max-w-4xl mx-auto">


                    {/* HEADER */}

                    <div className="mb-8">

                        <p className="text-[#ff6500] font-bold text-sm uppercase tracking-wider">
                            Crop Management
                        </p>

                        <h1 className="text-4xl font-bold text-[#111827]">
                            Edit Crop
                        </h1>

                        <p className="text-gray-600 mt-2">
                            Update your crop information.
                        </p>

                    </div>


                    {/* CARD */}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        <div className="bg-[#111827] text-white px-7 py-6 border-b-4 border-[#ff6500]">

                            <h2 className="text-2xl font-bold">
                                Crop Information
                            </h2>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="p-7 space-y-6"
                        >


                            {/* CROP NAME */}

                            <div>

                                <label className="form-label">
                                    Crop Name *
                                </label>

                                <input
                                    type="text"
                                    name="crop_name"
                                    value={form.crop_name}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />

                            </div>


                            {/* VARIETY */}

                            <div>

                                <label className="form-label">
                                    Crop Variety
                                </label>

                                <input
                                    type="text"
                                    name="crop_variety"
                                    value={form.crop_variety}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Example: Hybrid"
                                />

                            </div>


                            {/* QUANTITY */}

                            <div className="grid md:grid-cols-2 gap-6">

                                <div>

                                    <label className="form-label">
                                        Quantity *
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="form-input"
                                        required
                                    />

                                </div>


                                <div>

                                    <label className="form-label">
                                        Quantity Unit
                                    </label>

                                    <select
                                        name="quantity_unit"
                                        value={form.quantity_unit}
                                        onChange={handleChange}
                                        className="form-input"
                                    >

                                        <option value="kg">
                                            Kilogram (kg)
                                        </option>

                                        <option value="quintal">
                                            Quintal
                                        </option>

                                        <option value="ton">
                                            Ton
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* QUALITY + PRICE */}

                            <div className="grid md:grid-cols-2 gap-6">

                                <div>

                                    <label className="form-label">
                                        Quality
                                    </label>

                                    <select
                                        name="quality"
                                        value={form.quality}
                                        onChange={handleChange}
                                        className="form-input"
                                    >

                                        <option value="">
                                            Select quality
                                        </option>

                                        <option value="Premium">
                                            Premium
                                        </option>

                                        <option value="Good">
                                            Good
                                        </option>

                                        <option value="Average">
                                            Average
                                        </option>

                                        <option value="Low">
                                            Low
                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label className="form-label">
                                        Expected Price ₹
                                    </label>

                                    <input
                                        type="number"
                                        name="expected_price"
                                        value={form.expected_price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="form-input"
                                    />

                                </div>

                            </div>


                            {/* HARVEST DATE */}

                            <div>

                                <label className="form-label">
                                    Harvest Date
                                </label>

                                <input
                                    type="date"
                                    name="harvest_date"
                                    value={form.harvest_date}
                                    onChange={handleChange}
                                    className="form-input"
                                />

                            </div>


                            {/* STATUS */}

                            <div>

                                <label className="form-label">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={handleChange}
                                    className="form-input"
                                >

                                    <option value="available">
                                        Available
                                    </option>

                                    <option value="sold">
                                        Sold
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>


                            {/* CURRENT IMAGE */}

                            {oldImage && !preview && (

                                <div>

                                    <label className="form-label">
                                        Current Crop Image
                                    </label>

                                    <img
                                        src={getImageUrl(oldImage)}
                                        alt="Current crop"
                                        className="w-48 h-48 object-cover rounded-xl border"
                                    />

                                </div>

                            )}


                            {/* NEW IMAGE */}

                            <div>

                                <label className="form-label">
                                    Change Crop Image
                                </label>

                                <input
                                    id="crop-image"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImage}
                                    className="hidden"
                                />

                                <label
                                    htmlFor="crop-image"
                                    className="inline-block cursor-pointer bg-[#ff6500] hover:bg-[#e85b00] text-white px-6 py-3 rounded-lg font-bold"
                                >
                                    📷 Choose New Image
                                </label>


                                {preview && (

                                    <div className="mt-4">

                                        <img
                                            src={preview}
                                            alt="New crop preview"
                                            className="w-48 h-48 object-cover rounded-xl border"
                                        />

                                    </div>

                                )}

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="form-label">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="form-input resize-y"
                                    placeholder="Describe your crop..."
                                />

                            </div>


                            {/* ERROR */}

                            {error && (

                                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                                    {error}
                                </div>

                            )}


                            {/* SUCCESS */}

                            {message && (

                                <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
                                    ✓ {message}
                                </div>

                            )}


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/farmer/crops")
                                    }
                                    className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#ff6500] hover:bg-[#e85b00] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold"
                                >

                                    {saving
                                        ? "Updating..."
                                        : "💾 Update Crop"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </FarmerLayout>

    );

}


export default EditCrop;