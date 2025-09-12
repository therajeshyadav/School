"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, AlertCircle } from "lucide-react";

export default function EditSchoolPage() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
    image: "",
  });
  const [preview, setPreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await fetch(`/api/schools/${id}`);
        if (!res.ok) throw new Error("Failed to fetch school");
        const data = await res.json();
        setFormData(data);
        setPreview(data.image || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load school details ❌");
      } finally {
        setLoading(false);
      }
    }
    fetchSchool();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to your API
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.imageUrl) {
        setFormData((prev) => ({ ...prev, image: data.imageUrl }));
      } else {
        alert("Failed to upload image ❌");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        alert("School updated successfully ✅");
        router.push("/show-schools");
      } else {
        setErrorMessage(result.error || "Failed to update school ❌");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred ❌");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">Edit School</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label>Address *</Label>
                <Textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Contact & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contact *</Label>
                  <Input
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    name="email_id"
                    value={formData.email_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>School Image</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("imageInput").click()}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <div className="relative h-32 w-full mx-auto rounded-lg overflow-hidden">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreview(null);
                          setSelectedImage(null);
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500 mt-1">
                        Click to upload PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {submitting ? "Updating..." : "Update School"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
