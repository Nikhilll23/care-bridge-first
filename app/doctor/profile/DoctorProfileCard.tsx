import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Adjust path if needed
import { Badge } from "@/components/ui/badge"; // Adjust path if needed
import { Separator } from "@/components/ui/separator"; // Adjust path if needed
import {
  Mail,
  Phone,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Building,
  DollarSign,
  CalendarCheck,
  CalendarX,
  User, // Added for generic profile icon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"; // Optional: Add Avatar component
import { Doctor } from "@prisma/client";

// Helper function to format currency
const formatCurrency = (amount: Doctor["consultationFee"]) => {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : Number(amount);
  if (isNaN(numericAmount)) {
    return "N/A"; // Handle cases where conversion fails
  }
  // Adjust locale and currency code as needed (e.g., 'en-IN', 'INR')
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericAmount);
};

// Helper function to get initials
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
};

interface DoctorProfileCardProps {
  doctor: Doctor;
  // Optional: Add avatarSrc prop if you have profile images
  // avatarSrc?: string | null;
}

export function DoctorProfileCard({
  doctor /*, avatarSrc */,
}: DoctorProfileCardProps) {
  return (
    <Card className="mx-auto w-full max-w-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="text-center">
        {/* Optional Avatar */}
        <Avatar className="mx-auto mb-4 h-24 w-24 border-2 border-primary">
          {/* <AvatarImage src={avatarSrc ?? undefined} alt={`${doctor.firstName} ${doctor.lastName}`} /> */}
          <AvatarFallback className="bg-secondary text-3xl">
            {getInitials(doctor.firstName, doctor.lastName)}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="text-2xl font-bold">
          Dr. {doctor.firstName} {doctor.lastName}
        </CardTitle>
        <CardDescription className="flex items-center justify-center gap-1 text-lg font-medium text-primary">
          <Stethoscope className="h-5 w-5" />
          {doctor.specialization}
        </CardDescription>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Building className="h-4 w-4" /> {doctor.department}
          </Badge>
          <Badge variant="outline">{doctor.designation}</Badge>
        </div>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="space-y-4 px-6 py-4">
        {/* Professional Details */}
        <div className="space-y-2">
          <h3 className="text-md mb-1 flex items-center gap-1 font-semibold text-muted-foreground">
            <Briefcase className="h-4 w-4" /> Professional Details
          </h3>
          <p className="flex items-center text-sm">
            <GraduationCap className="mr-2 h-4 w-4 text-gray-500" />
            <span className="font-medium">Qualification:</span> 
            {doctor.qualification}
          </p>
          {doctor.experience !== null && doctor.experience !== undefined && (
            <p className="flex items-center text-sm">
              <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
              <span className="font-medium">Experience:</span> 
              {doctor.experience} years
            </p>
          )}
        </div>

        <Separator className="my-2" />

        {/* Contact Info */}
        <div className="space-y-2">
          <h3 className="text-md mb-1 flex items-center gap-1 font-semibold text-muted-foreground">
            <User className="h-4 w-4" /> Contact
          </h3>
          <p className="flex items-center break-all text-sm">
            <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
            <a
              href={`mailto:${doctor.email}`}
              className="text-blue-600 hover:underline"
            >
              {doctor.email}
            </a>
          </p>
          {doctor.phone && (
            <p className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
              <a
                href={`tel:${doctor.phone}`}
                className="text-blue-600 hover:underline"
              >
                {doctor.phone}
              </a>
            </p>
          )}
        </div>

        <Separator className="my-2" />

        {/* Consultation Fee */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 font-medium text-muted-foreground">
            <DollarSign className="h-4 w-4" /> Consultation Fee:
          </span>
          <span className="text-lg font-semibold text-green-700">
            {formatCurrency(doctor.consultationFee)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center rounded-b-lg bg-gray-50 p-4">
        <Badge
          variant={doctor.isAvailable ? "default" : "destructive"}
          className={`flex items-center gap-1 px-4 py-1.5 text-sm ${doctor.isAvailable ? "border border-green-300 bg-green-100 text-green-800" : "border border-red-300 bg-red-100 text-red-800"}`}
        >
          {doctor.isAvailable ? (
            <CalendarCheck className="h-4 w-4" />
          ) : (
            <CalendarX className="h-4 w-4" />
          )}
          {doctor.isAvailable
            ? "Available for Consultation"
            : "Currently Unavailable"}
        </Badge>
      </CardFooter>
    </Card>
  );
}
