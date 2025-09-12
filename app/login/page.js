"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const [step, setStep] = useState("email"); // email → otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("otp");
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send OTP",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong ❌" });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        login({ email });
        toast({ title: "Success", description: "Login successful!" });
        router.push("/add-school");
      } else {
        toast({ title: "Error", description: "Invalid OTP" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong ❌" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8 md:p-10">
        {step === "email" ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Button
              className="bg-blue-600 text-white px-4 py-3 rounded w-full text-center hover:bg-blue-700 transition"
              onClick={sendOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Enter 6-digit OTP
            </h2>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-4"
            />
            <Button
              className="w-full py-3"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
