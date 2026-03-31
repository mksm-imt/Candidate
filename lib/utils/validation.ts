import { z } from "zod";

export const ProfileSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  contractTypes: z.array(z.string()).optional(),
  remote: z.boolean().optional(),
  yearsExp: z.number().int().nonnegative().optional(),
  skills: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
});

export const ProviderKeySchema = z.object({
  provider: z.string().min(1),
  apiKey: z.string().min(1),
  config: z.record(z.unknown()).optional(),
});

export const SearchCriteriaSchema = z.object({
  title: z.string().optional(),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  contractTypes: z.array(z.string()).optional(),
  remote: z.boolean().optional(),
  yearsExp: z.number().optional(),
  keywords: z.array(z.string()).optional(),
  providerId: z.string().optional(),
});

export const CreateApplicationSchema = z.object({
  offerId: z.string().min(1),
  mode: z.enum(["AUTO", "SEMI", "MANUAL"]),
  notes: z.string().optional(),
});

export const UpdateApplicationSchema = z.object({
  status: z.enum(["PENDING", "SENT", "REVIEWING", "REJECTED", "ACCEPTED"]).optional(),
  notes: z.string().optional(),
});
