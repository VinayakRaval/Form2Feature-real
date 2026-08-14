import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FarmerLayout from "../../layouts/FarmerLayout";
import { addCrop } from "../../services/cropService";

function AddCrop() {
    const navigate = useNavigate();
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        crop_name: "",
        crop_variety: "",
        quantity: "",
        quantity_unit: "kg",
        quality: "",
        expected_price: "",
        harvest_date: "",
        description: ""
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // ==========================================
    // INPUT
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };

    // ==========================================
    // IMAGE
    // ==========================================
    const handleImage = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const allowed = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowed.includes(file.type)) {
            setError("Only JPG, PNG and WEBP images are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5 MB.");
            return;
        }

        setError("");
        setImage(file);
        setPreview(URL.createObjectURL(file));
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
            const data = new FormData();

            data.append("crop_name", form.crop_name);
            data.append("crop_variety", form.crop_variety);
            data.append("quantity", form.quantity);
            data.append("quantity_unit", form.quantity_unit);
            data.append("quality", form.quality);
            data.append("expected_price", form.expected_price);
            data.append("harvest_date", form.harvest_date);
            data.append("description", form.description);

            if (image) {
                data.append("image", image);
            }

            const result = await addCrop(data);

            if (!result.success) {
                throw new Error(result.message);
            }

            setMessage("Crop added successfully!");

            setTimeout(() => {
                navigate("/farmer/crops");
            }, 800);

        } catch (err) {
            console.error("Add Crop Error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to add crop."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <FarmerLayout>
            <div className="min-h-screen bg-[#f3f4f6] py-10 px-5">
                <div className="max-w-4xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-8">
                        <p className="text-[#ff6500] font-bold text-sm uppercase">
                            Crop Management
                        </p>
                        <h1 className="text-4xl font-bold text-[#111827]">
                            Add Crop
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Add your crop details for selling.
                        </p>
                    </div>

                    {/* CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-[#111827] text-white px-7 py-6 border-b-4 border-[#ff6500]">
                            <h2 className="text-2xl font-bold">
                                Crop Information
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-7 space-y-6">

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
                                    placeholder="Example: Tomato"
                                    required
                                />
                            </div>

                            {/* CROP VARIETY */}
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
                                    placeholder="Example: Arka Rakshak"
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
                                        step="0.01"
                                        min="0"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Example: 500"
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
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="quintal">Quintal</option>
                                        <option value="ton">Ton</option>
                                    </select>
                                </div>
                            </div>

                            {/* QUALITY + PRICE */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="form-label">
                                        Crop Quality
                                    </label>
                                    <select
                                        name="quality"
                                        value={form.quality}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option value="">Select quality</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Good">Good</option>
                                        <option value="Average">Average</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label">
                                        Expected Price ₹
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="expected_price"
                                        value={form.expected_price}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Expected price"
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

                            {/* IMAGE */}
                            <div>
                                <label className="form-label">
                                    Crop Image
                                </label>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleImage}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="bg-[#ff6500] hover:bg-[#e85b00] text-white px-6 py-3 rounded-lg font-bold"
                                >
                                    📷 Upload Crop Image
                                </button>

                                {preview && (
                                    <div className="mt-4">
                                        <img
                                            src={preview}
                                            alt="Crop preview"
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
                                    onClick={() => navigate("/farmer/crops")}
                                    className="border border-gray-300 px-6 py-3 rounded-lg font-semibold"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#ff6500] hover:bg-[#e85b00] disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-bold"
                                >
                                    {saving ? "Saving..." : "💾 Save Crop"}
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </FarmerLayout>
    );
}

export default AddCrop;