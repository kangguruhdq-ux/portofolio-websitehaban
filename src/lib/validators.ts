import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().optional(),
  identifier: z.string().optional(),
  password: z.string().min(1).max(100),
}).refine((data) => data.username || data.identifier, {
  message: 'Username atau email wajib diisi',
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  title: z.string().min(2).max(150),
  kicker: z.string().min(2).max(100),
  bio: z.string().min(10).max(5000),
  shortBio: z.string().min(5).max(500),
  avatarUrl: z.string().min(1),
  heroImageUrl: z.string().optional().nullable(),
  location: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  availability: z.string().min(2).max(100),
  resumeUrl: z.string().min(1),
  ctaText: z.string().min(2).max(50),
  ctaLink: z.string().min(1).max(100),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  instagramUrl: z.string().url(),
});

export const projectSchema = z.object({
  title: z.string().min(2).max(150),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  kicker: z.string().optional().nullable(),
  description: z.string().min(10).max(1000),
  longDescription: z.string().min(20).max(10000),
  thumbnail: z.string().min(1),
  gallery: z.array(z.string()).default([]),
  category: z.string().min(2).max(50),
  technologies: z.array(z.string()).min(1),
  githubUrl: z.string().url().optional().nullable().or(z.literal('')),
  liveUrl: z.string().url().optional().nullable().or(z.literal('')),
  simulatorKey: z.string().optional().nullable(),
  specifications: z.record(z.any()).optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  projectDate: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(2).max(50),
  icon: z.string().optional().nullable(),
  proficiency: z.number().int().min(1).max(100).default(90),
  sortOrder: z.number().int().default(0),
});

export const experienceSchema = z.object({
  company: z.string().min(2).max(150),
  role: z.string().min(2).max(150),
  description: z.string().min(10).max(5000),
  startDate: z.string().min(4).max(50),
  endDate: z.string().optional().nullable(),
  current: z.boolean().default(false),
  location: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  verified: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const educationSchema = z.object({
  institution: z.string().min(2).max(150),
  program: z.string().min(2).max(150),
  description: z.string().min(10).max(5000),
  startDate: z.string().min(4).max(50),
  endDate: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export const certificateSchema = z.object({
  title: z.string().min(2).max(200),
  issuer: z.string().min(2).max(150),
  issueDate: z.string().min(4).max(50),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable().or(z.literal('')),
  image: z.string().min(1),
  description: z.string().min(10).max(5000),
  skills: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
});

export const socialLinkSchema = z.object({
  platform: z.string().min(2).max(50),
  username: z.string().min(1).max(100),
  url: z.string().url(),
  icon: z.string().min(1).max(50),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const navigationSchema = z.object({
  label: z.string().min(2).max(50),
  url: z.string().min(1).max(200),
  isExternal: z.boolean().default(false),
  visible: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const seoSchema = z.object({
  siteTitle: z.string().min(5).max(150),
  metaDescription: z.string().min(10).max(500),
  keywords: z.string().min(3).max(500),
  ogTitle: z.string().min(5).max(150),
  ogDescription: z.string().min(10).max(500),
  ogImage: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
});

export const visitorLogSchema = z.object({
  author: z.string().min(2).max(40),
  role: z.enum(['RECRUITER', 'DEVELOPER', 'SECURITY', 'CLIENT', 'VISITOR']).default('VISITOR'),
  message: z.string().min(3).max(500),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().optional().nullable(),
  message: z.string().min(10).max(3000),
});

export const techStackSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  logo: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export const terminalCommandSchema = z.object({
  command: z.string().min(1).max(50),
  description: z.string().optional().nullable(),
  response: z.string().min(1),
  category: z.string().default('CUSTOM'),
  sortOrder: z.number().int().default(0),
});
