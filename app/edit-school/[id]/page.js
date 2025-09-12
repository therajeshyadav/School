"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    contact: "",
    email_id: "",
    image: "", // will hold image URL or base64
  });
  const [preview, setPreview] = useState(""); // for showing preview
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await fetch(`/api/schools/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setFormData(data);
        setPreview(data.image || ""); // set preview
      } catch (err) {
        console.error("Error fetching school:", err);
        alert("Could not load school details ❌");
      } finally {
        setLoading(false);
      }
    }
    fetchSchool();
  }, [id]);

  // ✅ Handle text input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle image file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // base64
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // auth ke liye
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        alert("School updated successfully ✅");
        router.push("/show-schools");
      } else {
        alert(data.error || "Failed to update school ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit School</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text fields */}
        <div>
          <Label>Name</Label>
          <Input
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Address</Label>
          <Input
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>City</Label>
          <Input
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>State</Label>
          <Input
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Contact</Label>
          <Input
            name="contact"
            value={formData.contact || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            name="email_id"
            type="email"
            value={formData.email_id || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload + Preview */}
        <div>
          <Label>School Image</Label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Update School
        </Button>
      </form>
    </div>
  );
}
