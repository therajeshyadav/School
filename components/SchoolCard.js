"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function SchoolCard({ school, onDelete }) {
  const { user } = useAuth();
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/edit-school/${school.id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this school?")) return;

    try {
      const res = await fetch(`/api/schools/${school.id}`, {
        method: "DELETE",
        credentials: "include", // important for JWT cookie
      });

      // Check if response is JSON
      if (!res.ok) {
        const text = await res.text(); // fallback
        throw new Error(`Server error: ${res.status} ${text}`);
      }

      const data = await res.json(); // ✅ now safe
      if (data.success) {
        alert("School deleted successfully");
        if (onDelete) onDelete(school.id);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete school");
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            school.image ||
            "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=400"
          }
          alt={school.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900">
          {school.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="line-clamp-1">{school.address}</p>
              <p className="text-gray-500">
                {school.city}, {school.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-500" />
            <span>{school.contact}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-purple-500" />
            <span className="line-clamp-1">{school.email_id}</span>
          </div>
        </div>

        {user && user.email === school.created_by && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 flex justify-center items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 flex justify-center items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
