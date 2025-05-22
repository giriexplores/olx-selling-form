import React, { useState } from "react";
import { Camera, X, AlertCircle, ChevronDown } from "lucide-react";
import { z } from "zod";
import { propertyFormSchema } from "../lib/zod";
import {
  propertyTypes,
  bhkOptions,
  bathroomOptions,
  furnishingOptions,
  projectStatusOptions,
  listedByOptions,
  carParkingOptions,
  facingOptions,
  indianStates,
} from "../data";

type PropertyFormData = z.infer<typeof propertyFormSchema>;

export default function OLXPropertyForm() {
  const [formData, setFormData] = useState<Partial<PropertyFormData>>({
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 20) {
      setErrors((prev) => ({ ...prev, images: "Maximum 20 photos allowed" }));
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({
        ...prev,
        images: "Some files were rejected. Only images under 10MB are allowed.",
      }));
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);

    // Create previews
    const newPreviews = [...imagePreviews];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });

    setFormData((prev) => ({ ...prev, images: newImages }));

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const validateForm = () => {
    try {
      propertyFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        alert("Property ad posted successfully!");
        console.log("Form Data:", formData);
        setIsSubmitting(false);
        // Reset form
        setFormData({ images: [] });
        setImages([]);
        setImagePreviews([]);
      }, 2000);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-md shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 p-4">
            <h1 className="text-xl font-bold text-gray-900">Post your Ad</h1>
          </div>

          {/* Selected Category */}
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4">SELECTED CATEGORY</h2>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span>Properties / </span>
                <span>For Sale: Houses & Apartments</span>
              </div>
              <button
                type="button"
                className="text-blue-800 text-sm font-medium flex items-center border-b-2"
              >
                Change
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-4 space-y-6">
              {/* Include some details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  INCLUDE SOME DETAILS
                </h2>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                      <div key={type} className="relative">
                        <input
                          type="radio"
                          id={`type-${type}`}
                          name="propertyType"
                          value={type}
                          checked={formData.type === type}
                          onChange={() => handleInputChange("type", type)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className={`p-2 text-sm border rounded-md block text-left hover:bg-blue-500/20 cursor-pointer ${
                            formData.type === type
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300"
                          }`}
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.type}
                    </p>
                  )}
                </div>

                {/* BHK */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bhk-group">
                    BHK
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bhkOptions.map((bhk) => (
                      <div key={bhk} className="relative">
                        <input
                          type="radio"
                          id={`bhk-${bhk}`}
                          name="bhkOption"
                          value={bhk}
                          checked={formData.bhk === bhk}
                          onChange={() => handleInputChange("bhk", bhk)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={`bhk-${bhk}`}
                          className={`px-6 py-2 text-sm border rounded-sm block cursor-pointer ${
                            formData.bhk === bhk
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300"
                          }`}
                        >
                          {bhk}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.bhk && (
                    <p className="text-red-500 text-sm mt-1">{errors.bhk}</p>
                  )}
                </div>

                {/*  Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bathrooms-group">
                    Bathrooms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {bathroomOptions.map((bathroom) => (
                      <div key={bathroom} className="relative">
                        <input
                          type="radio"
                          id={`bathroom-${bathroom}`}
                          name="bathroomOption"
                          value={bathroom}
                          checked={formData.bathrooms === bathroom}
                          onChange={() => handleInputChange("bathrooms", bathroom)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={`bathroom-${bathroom}`}
                          className={`px-6 py-2 text-sm border rounded-sm block cursor-pointer ${
                            formData.bathrooms === bathroom
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300"
                          }`}
                        >
                          {bathroom}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.bathrooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bathrooms}
                    </p>
                  )}
                </div>

                {/* Furnishing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="furnishing-group">
                    Furnishing
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {furnishingOptions.map((option) => (
                      <div key={option} className="relative">
                        <input
                          type="radio"
                          id={`furnishing-${option}`}
                          name="furnishingOption"
                          value={option}
                          checked={formData.furnishing === option}
                          onChange={() => handleInputChange("furnishing", option)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={`furnishing-${option}`}
                          className={`px-4 py-2 text-sm border rounded-md block cursor-pointer ${
                            formData.furnishing === option
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300"
                          }`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.furnishing && (
                    <p className="text-red-500 text-sm mt-1">{errors.furnishing}</p>
                  )}
                </div>

                {/* Project Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="project-status-group">
                    Project Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projectStatusOptions.map((status) => (
                      <div key={status} className="relative">
                        <input
                          type="radio"
                          id={`project-status-${status}`}
                          name="projectStatusOption"
                          value={status}
                          checked={formData.projectStatus === status}
                          onChange={() => handleInputChange("projectStatus", status)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={`project-status-${status}`}
                          className={`px-4 py-2 text-sm border rounded-md block cursor-pointer ${
                            formData.projectStatus === status
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300"
                          }`}
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.projectStatus && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.projectStatus}
                    </p>
                  )}
                </div>

                {/* Listed By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="listed-by-group">
                    Listed by
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {listedByOptions.map((option) => (
                      <div key={option} className="relative">
                        <input
                          type="radio"
                          id={`listed-by-${option}`}
                          name="listedByOption"
                          value={option}
                          checked={formData.listedBy === option}
                          onChange={() => handleInputChange("listedBy", option)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={`listed-by-${option}`}
                          className={`px-4 py-2 text-sm border rounded-md block cursor-pointer ${
                            formData.listedBy === option
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300"
                          }`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.listedBy && (
                    <p className="text-red-500 text-sm mt-1">{errors.listedBy}</p>
                  )}
                </div>

                {/* Area Details */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Super Builtup area sqft{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.superBuiltupArea || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "superBuiltupArea",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.superBuiltupArea
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      id="super-builtup-area"
                    />
                    {errors.superBuiltupArea && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.superBuiltupArea}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carpet Area sqft <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.carpetArea || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "carpetArea",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.carpetArea ? "border-red-500" : "border-gray-300"
                      }`}
                      id="carpet-area"
                    />
                    {errors.carpetArea && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.carpetArea}
                      </p>
                    )}
                  </div>
                </div>

                {/* Maintenance */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance (Monthly)
                  </label>
                  <input
                    type="number"
                    value={formData.maintenance || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "maintenance",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="maintenance"
                  />
                </div>

                {/* Total Floors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    value={formData.totalFloors || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "totalFloors",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.totalFloors ? "border-red-500" : "border-gray-300"
                    }`}
                    id="total-floors"
                  />
                  {errors.totalFloors && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalFloors}
                    </p>
                  )}
                </div>

                {/* Floor No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor No
                  </label>
                  <input
                    type="number"
                    value={formData.floorNo || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "floorNo",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.floorNo ? "border-red-500" : "border-gray-300"
                    }`}
                    id="floor-no"
                  />
                  {errors.floorNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.floorNo}
                    </p>
                  )}
                </div>

                {/* Car Parking */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="car-parking-group">
                    Car Parking
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {carParkingOptions.map((option) => (
                      <div key={option} className="relative">
                        <input
                          type="radio"
                          id={`car-parking-${option}`}
                          name="carParkingOption"
                          value={option}
                          checked={formData.carParking === option}
                          onChange={() => handleInputChange("carParking", option)}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={`car-parking-${option}`}
                          className={`px-6 py-2 text-sm border rounded-sm block cursor-pointer ${
                            formData.carParking === option
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300"
                          }`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.carParking && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.carParking}
                    </p>
                  )}
                </div>

                {/* Facing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facing <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.facing || ""}
                      onChange={(e) =>
                        handleInputChange("facing", e.target.value)
                      }
                      className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                        errors.facing ? "border-red-500" : "border-gray-300"
                      }`}
                      id="facing"
                    >
                      <option value=""></option>
                      {facingOptions.map((face) => (
                        <option key={face} value={face}>
                          {face}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {errors.facing && (
                    <p className="text-red-500 text-sm mt-1">{errors.facing}</p>
                  )}
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.projectName || ""}
                    onChange={(e) =>
                      handleInputChange("projectName", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    id="project-name"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    {(formData.projectName || "").length} / 70
                  </p>
                </div>

                {/* Ad Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.adTitle || ""}
                    onChange={(e) =>
                      handleInputChange("adTitle", e.target.value)
                    }
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.adTitle ? "border-red-500" : "border-gray-300"
                    }`}
                    id="ad-title"
                  />
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>
                      Mention the key features of your item (e.g. brand, model,
                      age, type){" "}
                    </span>

                    <p className="text-gray-500 text-sm mt-1">
                      {(formData.adTitle || "").length} / 70
                    </p>
                  </div>
                  {errors.adTitle && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.adTitle}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={5}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    id="description"
                  />
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>
                      Include condition, features and reason for selling
                    </span>
                    <p className="text-gray-500 text-sm mt-1">
                      {(formData.description || "").length} / 4096
                    </p>
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Set a price */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Set a price
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={`w-full pl-8 pr-3 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      id="price"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              {/* Upload photos */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 uppercase">
                  Upload up to 20 photos
                </h2>

                <div className="flex flex-wrap items-center justify-start gap-2">
                  {/* First slot - Add Photo button */}
                  <label className="aspect-square border-2 border-gray-400 rounded-sm flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors bg-white w-20 h-20">
                    <Camera className="w-8 h-8 text-gray-600 mb-1" />
                    <span className="text-xs text-gray-600 text-center">
                      Add Photo
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded images */}
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square w-20 h-20"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-sm border border-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Empty photo slots */}
                  {Array.from({ length: Math.min(19 - images.length, 19) }).map(
                    (_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square border-2 border-gray-300 rounded-sm flex items-center justify-center bg-gray-50 w-20 h-20"
                      >
                        <Camera className="w-6 h-6 text-gray-300" />
                      </div>
                    )
                  )}
                </div>

                {errors.images && (
                  <p className="text-red-500 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.images}
                  </p>
                )}
              </div>

              {/* Confirm location */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 uppercase">
                  Confirm your location
                </h2>

                <div className="flex border-b border-gray-200">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-white"
                  >
                    LIST
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    CURRENT LOCATION
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.state || ""}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className={`w-full p-3 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                      id="state"
                      name="state"
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              {/* Review details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 uppercase">
                  Review your details
                </h2>

                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-md">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center relative">
                    <div className="text-white text-xl font-bold">👤</div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value="Dummy Name"
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-sm bg-white text-gray-900"
                        id="review-name"
                      />
                      <div className="text-right text-xs text-gray-500 mt-1">
                        18 / 30
                      </div>
                      <div className="flex justify-between mt-4">
                        <span>Your phone number</span>
                        <span>+XX_XXXXXXXXXX</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-blue-600 text-white py-4 px-6 rounded-md font-semibold text-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "POSTING..." : "POST NOW"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
