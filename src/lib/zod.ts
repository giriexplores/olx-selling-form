import { z } from "zod";

export const propertyFormSchema = z.object({
  type: z.string().min(1, "Please select property type"),
  bhk: z.string().min(1, "Please select BHK"),
  bathrooms: z.string().min(1, "Please select number of bathrooms"),
  furnishing: z.string().min(1, "Please select furnishing type"),
  projectStatus: z.string().min(1, "Please select project status"),
  listedBy: z.string().min(1, "Please select who is listing"),
  superBuiltupArea: z.number().min(1, "Super builtup area is required"),
  carpetArea: z.number().min(1, "Carpet area is required"),
  maintenance: z.number().optional(),
  totalFloors: z.number().min(1, "Total floors is required"),
  floorNo: z.number().min(0, "Floor number is required"),
  carParking: z.string().min(1, "Please select car parking"),
  facing: z.string().min(1, "Please select facing direction"),
  projectName: z
    .string()
    .max(70, "Project name must be less than 70 characters")
    .optional(),
  adTitle: z
    .string()
    .min(1, "Ad title is required")
    .max(70, "Ad title must be less than 70 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(4096, "Description must be less than 4096 characters"),
  price: z.number().min(1, "Price is required"),
  images: z
    .array(z.any())
    .min(1, "At least one photo is required")
    .max(20, "Maximum 20 photos allowed"),
  state: z.string().min(1, "Please select a state"),
});


