#!/usr/bin/env node

/**
 * Bulk update clinic hours in Airtable based on scraped website data.
 *
 * Usage:
 *   node scripts/bulk-update-hours.js          # Dry run
 *   node scripts/bulk-update-hours.js --execute # Actually update
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load token from .env
const envPath = path.join(rootDir, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const idx = line.indexOf("=");
  if (idx > 0) {
    envVars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
});
const TOKEN = envVars.AIRTABLE_TOKEN;

const BASE_ID = "app2GMlVxnjw6ifzz";
const CLINICS_TABLE = "tblx7sVpDo17Hkmmr";
const HOURS_TABLE = "tblp2gxzk6xGeDtnI";

const EXECUTE = process.argv.includes("--execute");

// Hours data scraped from websites - December 2025
const HOURS_BY_CLINIC_NAME = {
  // NYC DOH Sexual Health Clinics
  "NYC DOH - Chelsea Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],
  "NYC DOH - Fort Greene Sexual Health Clinic": [
    {
      days: ["Mon", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
    { days: ["Tue"], open: "08:30", close: "19:00", department: "Express" },
  ],
  "NYC DOH - Morrisania Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],
  "NYC DOH - Jamaica Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],
  "NYC DOH - Central Harlem Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],

  // Institute for Family Health locations
  "Mt. Hope Family Practice": [
    { days: ["Mon"], open: "08:30", close: "19:00", department: "General" },
    {
      days: ["Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Stevenson Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Urban Horizons Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Walton Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Cadman Family Health  Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Amsterdam Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Family Health Center of Harlem": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Institute for Family Health at 17th Street": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "The Family Health Center of Harlem": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],

  // Nios Spa - electrolysis (7 days)
  "Nios Spa - Manhattan": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "20:00",
      department: "General",
    },
  ],
  "Nios Spa - Brooklyn": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "20:00",
      department: "General",
    },
  ],

  // Montefiore Oval Center
  "The Oval Center at Montefiore Medical Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],

  // AIDS Healthcare Foundation
  "AIDS Healthcare Foundation": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Apicha Community Health Center - December 2025
  "Apicha Community Health Center (Manhattan)": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:30",
      department: "General",
    },
  ],
  "Apicha Community Health Center (Jackson Heights)": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:30",
      department: "General",
    },
  ],

  // Mount Sinai Adolescent Health Center - December 2025
  "Mount Sinai Adolescent Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Thu"],
      open: "12:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "08:30",
      close: "16:00",
      department: "General",
    },
  ],

  // Charles B. Wang Community Health Center - December 2025
  "Charles B. Wang Community Health Center (Chinatown)": [
    {
      days: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "18:00",
      department: "General",
    },
    {
      days: ["Wed"],
      open: "10:00",
      close: "18:00",
      department: "General",
    },
  ],
  "Charles B. Wang Community Health Center (Flushing)": [
    {
      days: ["Mon", "Tue", "Thu", "Fri", "Sat", "Sun"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Wed"],
      open: "10:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Betances Health Center - December 2025
  "Betances Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Thu"],
      open: "10:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "10:00",
      close: "14:00",
      department: "General",
    },
  ],

  // GMHC - December 2025
  "GMHC Testing Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:30",
      close: "16:30",
      department: "General",
    },
  ],

  // Callen-Lorde Community Health Center - December 2025
  "Callen-Lorde Chelsea": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:15",
      close: "20:15",
      department: "General",
    },
    {
      days: ["Fri"],
      open: "09:45",
      close: "16:45",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "15:15",
      department: "General",
    },
  ],
  "Callen-Lorde Brooklyn": [
    {
      days: ["Mon", "Tue"],
      open: "08:30",
      close: "20:00",
      department: "General",
    },
    {
      days: ["Wed", "Thu"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Fri"],
      open: "10:00",
      close: "16:45",
      department: "General",
    },
  ],
  "Callen-Lorde Bronx": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:30",
      close: "19:30",
      department: "General",
    },
    {
      days: ["Fri"],
      open: "10:30",
      close: "16:30",
      department: "General",
    },
  ],

  // Urban Health Plan - December 2025
  "Urban Health Plan": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Urban Health Plan Adolescent Health and Wellness Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "18:00",
      department: "General",
    },
  ],

  // Wakefield Ambulatory Care Center - December 2025
  "Wakefield Ambulatory Care Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // BronxCare Health System - December 2025
  "BronxCare Fulton Family Medicine Practice": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Sun River Health - December 2025
  "Sun River Health": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Planned Parenthood of Greater NY - December 2025
  "Planned Parenthood of New York City Margaret Sanger Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "15:00",
      department: "General",
    },
  ],
  "Planned Parenthood - Joan Malin Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "15:00",
      department: "General",
    },
  ],
  "Planned Parenthood - The Bronx Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Planned Parenthood - Queens (Diane L. Max)": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Planned Parenthood - Staten Island Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // NYC H+H Harlem - December 2025
  "NYC Health + Hospitals / Harlem": [
    {
      days: ["Mon", "Tue", "Wed", "Thu"],
      open: "08:00",
      close: "19:00",
      department: "General",
    },
    {
      days: ["Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "13:00",
      department: "General",
    },
  ],

  // Peter Krueger Clinic (Mount Sinai) - December 2025
  "Mount Sinai Beth Israel Peter Krueger Clinic": [
    {
      days: ["Mon"],
      open: "08:30",
      close: "17:30",
      department: "General",
    },
    {
      days: ["Tue", "Wed", "Thu"],
      open: "08:30",
      close: "18:00",
      department: "General",
    },
    {
      days: ["Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],

  // Young Men's Clinic (NYP) - December 2025
  "The Young Men's Clinic": [
    {
      days: ["Mon", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Tue", "Wed"],
      open: "08:00",
      close: "19:00",
      department: "General",
    },
    {
      days: ["Thu"],
      open: "08:00",
      close: "13:00",
      department: "General",
    },
  ],

  // Center for Special Studies (NYP) - December 2025
  "New York Presbyterian Hospital - Center for Special Studies": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Bedford-Stuyvesant FHC - December 2025
  "Bedford-Stuyvesant Family Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Thu"],
      open: "09:00",
      close: "19:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "08:00",
      close: "15:00",
      department: "General",
    },
  ],

  // Boriken Neighborhood Health Center - December 2025
  "Boriken Neighborhood Health Center - East Harlem Council for Human Services":
    [
      {
        days: ["Mon", "Wed"],
        open: "08:00",
        close: "18:00",
        department: "General",
      },
      {
        days: ["Tue", "Thu", "Fri"],
        open: "08:00",
        close: "17:00",
        department: "General",
      },
      {
        days: ["Sat"],
        open: "08:00",
        close: "16:00",
        department: "General",
      },
    ],

  // Settlement Health (106 St) - December 2025
  "Settlement Health": [
    {
      days: ["Mon", "Tue", "Thu", "Fri"],
      open: "08:30",
      close: "16:45",
      department: "General",
    },
    {
      days: ["Wed"],
      open: "10:30",
      close: "16:45",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "08:45",
      close: "16:30",
      department: "General",
    },
  ],

  // South Brooklyn Health (Coney Island) - December 2025
  "Coney Island Hospital": [
    {
      days: ["Mon", "Fri"],
      open: "08:00",
      close: "16:00",
      department: "General",
    },
    {
      days: ["Tue", "Wed", "Thu"],
      open: "08:00",
      close: "19:00",
      department: "General",
    },
  ],

  // Pierre Toussaint Family Health Center - December 2025
  "Pierre Toussaint Family Health Center": [
    {
      days: ["Mon", "Wed", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Tue", "Thu"],
      open: "09:00",
      close: "20:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "09:00",
      close: "16:00",
      department: "General",
    },
  ],

  // Morris Heights Health Center - December 2025
  "Morris Heights Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
    {
      days: ["Sat"],
      open: "08:00",
      close: "14:00",
      department: "General",
    },
  ],

  // Community Healthcare Network - December 2025
  "Community Healthcare Network": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Montefiore locations - December 2025 (8:30am-5pm M-F standard)
  "Montefiore On Point": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Montefiore Medical Center - Comprehensive Health Care Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Montefiore Medical Center - Comprehensive Family Care Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Montefiore Center for Positive Living/I.D. Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],

  // BronxCare - December 2025
  "Bronx-Lebanon Hospital Center for Comprehensive Care": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Gouverneur - December 2025
  "Gouverneur Healthcare Services": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Destination Tomorrow - December 2025
  "Destination Tomorrow": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "10:00",
      close: "18:00",
      department: "General",
    },
  ],

  // Ryan Health - December 2025
  "William F. Ryan Community Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Brookdale Family Care Center - December 2025
  "Brookdale Family Care Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Judson Community Health Center - December 2025
  "Judson Community Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Wyckoff Hospital - December 2025
  "Wyckoff Hospital": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Weill Cornell - December 2025
  "Weill Cornell Medical Associates": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Mount Sinai Family Planning - December 2025
  "Mount Sinai West Family Planning": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Mount Sinai Hospital Family Planning": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Spencer Cox Center - December 2025
  "The Spencer Cox Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Columbia - December 2025
  "Columbia University Family Planning": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Mount Sinai Union Square - December 2025
  "Mount Sinai Beth Israel": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Damian Firehouse - December 2025
  "Damian Firehouse Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Henry Street Settlement - December 2025
  "Henry Street Settlement Health Unlimited Family Medical Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Tia Clinic - December 2025
  "Tia Clinic Flatiron": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "18:00",
      department: "General",
    },
  ],

  // CCHP - December 2025
  "Center for Comprehensive Health Practice": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // Adolescent AIDS Program (CHAM) - December 2025
  "Adolescent AIDS Program, Children's Hospital at Montefiore": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // NYC DOH Corona - December 2025
  "NYC DOH - Corona Sexual Health Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "15:30",
      department: "General",
    },
  ],

  // Mount Sinai CTMS - December 2025
  "Mount Sinai Center for Transgender Medicine and Surgery (CTMS)": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],

  // NYU Langone Transgender - December 2025
  "NYU Langone Transgender Health Program": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "NYU Langone Hassenfeld Childrens Hospital - Transgender Youth Health Program":
    [
      {
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open: "09:00",
        close: "17:00",
        department: "General",
      },
    ],

  // Additional clinics from missing list - December 2025
  "Mount Sinai Hospital Jack Martin Fund Clinic": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Internal Medicine Associates / REACH Program": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Lenox Hill Hospital - Retroviral Disease Center (Northwell Health)": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Bella Vista Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Maimonides EPAC (Early Pregnancy Assessment Center)": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Comprehensive Health Program New York Presbyterian Hospital": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Maimonides Life Forward Program": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "VIP Community Services": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Third Street Clinic Project Renewal": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Northwell Health - PrEP/HIV/Sexual Health Program at Rego Park": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Community Health Action of Staten Island (CHASI)": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Department of Medicine Faculty Practice": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:30",
      close: "17:00",
      department: "General",
    },
  ],
  "Medysis Family Medicine": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  // Note: These names were fixed in Airtable (had <br /> tags)
  "Happy Healthy New York": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Acacia Network Clay Avenue Health Center": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Westside Family Medicine": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Mount Sinai - Voice Therapy": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "John Gargan, NP in Family Health, PC": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Brownsville Family Health and Wellness Center @ Bristol": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "08:00",
      close: "17:00",
      department: "General",
    },
  ],
  "Columbia Doctors Nurse Practitioner Group": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
  "West Midtown Medical Group": [
    {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      open: "09:00",
      close: "17:00",
      department: "General",
    },
  ],
};

async function fetchAllClinics() {
  const records = [];
  let offset = null;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${BASE_ID}/${CLINICS_TABLE}`,
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!res.ok) {
      throw new Error(`Airtable API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

async function fetchExistingHours(clinicId) {
  const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`);
  url.searchParams.set("filterByFormula", `{Clinic} = "${clinicId}"`);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`Airtable API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.records;
}

async function deleteHoursRecord(recordId) {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}/${recordId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    },
  );

  if (!res.ok) {
    throw new Error(`Delete error: ${res.status} ${await res.text()}`);
  }
  return true;
}

async function createHoursRecord(clinicId, hours) {
  const fields = {
    Clinic: [clinicId],
    Department: hours.department,
    "Days of Week": hours.days,
    "Open Time": hours.open,
    "Close Time": hours.close,
  };

  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${HOURS_TABLE}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    },
  );

  if (!res.ok) {
    throw new Error(`Create error: ${res.status} ${await res.text()}`);
  }

  return await res.json();
}

async function updateClinicHours(clinicId, clinicName, newHours) {
  console.log(`\nUpdating: ${clinicName}`);

  // 1. Fetch existing hours
  const existing = await fetchExistingHours(clinicId);

  // Skip if already has hours
  if (existing.length > 0) {
    console.log(`  Already has ${existing.length} hours records - skipping`);
    return false;
  }

  if (!EXECUTE) {
    console.log(`  Would add ${newHours.length} hours records (dry run)`);
    for (const h of newHours) {
      console.log(`    ${h.days.join(", ")}: ${h.open}-${h.close}`);
    }
    return false;
  }

  // 2. Create new hours
  for (const hours of newHours) {
    await createHoursRecord(clinicId, hours);
    console.log(
      `  Created: ${hours.days.join(", ")} ${hours.open}-${hours.close}`,
    );
    await new Promise((r) => setTimeout(r, 250)); // Rate limit
  }

  return true;
}

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN ===");
  console.log("");

  const clinics = await fetchAllClinics();
  console.log(`Fetched ${clinics.length} clinics from Airtable`);

  // Build map of clinic name -> record ID
  const clinicMap = new Map();
  for (const clinic of clinics) {
    const name = clinic.fields["Clinic Name"];
    if (name) {
      clinicMap.set(name, clinic.id);
    }
  }

  let updated = 0;
  let matched = 0;

  for (const [clinicName, hours] of Object.entries(HOURS_BY_CLINIC_NAME)) {
    const clinicId = clinicMap.get(clinicName);

    if (!clinicId) {
      console.log(`\nNOT FOUND: ${clinicName}`);
      continue;
    }

    matched++;
    const wasUpdated = await updateClinicHours(clinicId, clinicName, hours);
    if (wasUpdated) updated++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Matched: ${matched} clinics`);
  console.log(`Updated: ${updated} clinics`);

  if (!EXECUTE) {
    console.log("\nThis was a dry run. Use --execute to apply changes.");
  } else {
    console.log("\nRun `npm run fetch-data` to regenerate GeoJSON.");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
