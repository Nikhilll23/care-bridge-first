"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    role: "USER", // Default role
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 201) {
        setMessage("User created successfully!");
      } else if (response.status === 409) {
        setMessage("User already exists.");
      } else {
        setMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="flex px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-center text-3xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Account Type
                </Label>
                <Select
                  onValueChange={handleRoleChange}
                  defaultValue={formData.role}
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User Account</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {message && (
              <div
                className={cn(
                  "rounded-md p-3 text-sm",
                  message.includes("success")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700",
                )}
              >
                {message}
              </div>
            )}

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load saved credentials from localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setFormData({ email: savedEmail, password: savedPassword });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Show success animation before redirect
      setIsSuccess(true);

      // Save credentials to localStorage
      localStorage.setItem('email', formData.email);
      localStorage.setItem('password', formData.password);

      // Delay redirect to show success animation
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 3000);
    } catch (error) {
      setError("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-background relative overflow-hidden theme-transition">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Welcome Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
          <div className="animate-success-bounce flex flex-col items-center space-y-6 text-center">
            {/* Success Card */}
            <div className="glassmorphism-theme rounded-3xl p-8 shadow-2xl max-w-md w-full">
              {/* Success Icon */}
              <div className="animate-check-mark flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg mx-auto mb-6">
                <svg
                  className="h-12 w-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                    className="animate-draw-check"
                  />
                </svg>
              </div>
              
              {/* Welcome Text */}
              <div className="animate-fade-in-up space-y-4">
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Welcome Back!
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  Successfully signed in to CareBridge
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Preparing your dashboard...</span>
                </div>
              </div>
            </div>
            
            {/* Loading Animation */}
            <div className="animate-fade-in-up flex items-center space-x-2" style={{ animationDelay: "0.5s" }}>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Login Form Section */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-slide-in-left w-full max-w-md space-y-6">
          {/* Header */}
          <div className="animate-fade-in-down space-y-2 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue to CareBridge
            </p>
          </div>

          {/* Form Card */}
          <Card className="animate-scale-in border-0 bg-card/95 shadow-xl backdrop-blur-sm">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Email Field */}
                  <div
                    className="animate-slide-in-right space-y-2"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={formData.email || "test@carebridge.com"}
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg"
                    />
                  </div>

                  {/* Password Field */}
                  <div
                    className="animate-slide-in-right space-y-2"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder={formData.password ? "••••••••" : "password123"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="animate-shake rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                    <div className="flex items-center space-x-2">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className={cn(
                    "animate-slide-in-up h-12 w-full text-base font-semibold transition-all duration-300",
                    "hover:scale-105 hover:shadow-lg active:scale-95",
                    isLoading && "animate-pulse",
                  )}
                  style={{ animationDelay: "0.6s" }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div
                className="animate-fade-in relative my-8"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">
                    Test Credentials
                  </span>
                </div>
              </div>

              {/* Test Credentials Info
              <div
                className="animate-fade-in rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm"
                style={{ animationDelay: "1s" }}
              >
                <p className="mb-1 font-medium text-blue-800">Test Account:</p>
                <p className="text-blue-600">Email: test@automed.com</p>
                <p className="text-blue-600">Password: password123</p>
              </div> */}
            </CardContent>

            <CardFooter
              className="animate-fade-in rounded-b-lg bg-muted/50 px-8 py-6"
              style={{ animationDelay: "1.2s" }}
            >
              <p className="w-full text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 font-semibold text-primary transition-colors hover:text-primary/80"
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="animate-slide-in-right hidden items-center justify-center bg-gradient-to-br from-primary/10 via-accent/5 to-background p-12 lg:flex relative overflow-hidden theme-transition">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-md space-y-6 text-center">
          <div className="animate-bounce-slow">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent shadow-2xl glassmorphism-theme">
              <svg
                className="h-12 w-12 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="animate-fade-in-up text-4xl font-bold text-foreground">
            CareBridge
          </h2>
          <p
            className="animate-fade-in-up text-xl text-muted-foreground"
            style={{ animationDelay: "0.2s" }}
          >
            Your comprehensive hospital management solution
          </p>
          <div
            className="animate-fade-in-up space-y-2"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-muted-foreground">✨ Streamlined patient care</p>
            <p className="text-muted-foreground">📊 Advanced analytics</p>
            <p className="text-muted-foreground">🔒 Secure & compliant</p>
          </div>
          
          {/* Feature card */}
          <div className="animate-fade-in-up glassmorphism-theme rounded-2xl p-6 mt-8 shadow-2xl" style={{ animationDelay: "0.6s" }}>
            <p className="text-foreground font-semibold text-lg mb-2">Ready to get started?</p>
            <p className="text-muted-foreground text-sm">Experience the future of healthcare management with our intuitive platform</p>
          </div>
        </div>
      </div>
    </div>
  );
}
