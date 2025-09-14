"use client";
import { SchoolForm } from "@/components/SchoolForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function AddSchoolPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login"); 
        } else {
          setUser(data.user);
        }
      });
  }, []); 

  if (!user) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }
  return <SchoolForm />;
}
