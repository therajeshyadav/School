"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [step, setStep] = useState("email"); // email → otp
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0); // countdown state

  const router = useRouter();
  const { login } = useAuth();

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("otp");
        setResendTimer(30); // lock resend for 30s
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        login({ email });
        router.push("/add-school");
      } else {
        setMessage("Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // countdown effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

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
              className="bg-blue-600 text-white px-4 py-3 rounded w-full text-center hover:bg-blue-700 transition"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Resend OTP Button */}
            <div className="mt-4 text-center">
              {resendTimer > 0 ? (
                <p className="text-gray-500">
                  Resend OTP in{" "}
                  <span className="font-semibold">{resendTimer}s</span>
                </p>
              ) : (
                <Button
                  variant="outline"
                  onClick={sendOtp}
                  disabled={loading}
                  className="mt-2 w-full"
                >
                  Resend OTP
                </Button>
              )}
            </div>
          </>
        )}

        {/* Inline message */}
        {message && (
          <p className="mt-4 text-center text-red-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
