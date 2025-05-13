import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Calendar } from "../components/ui/calendar";

const CATEGORY_EXPIRY = {
  "Fee earning": null,
  "Marketing": 14,
  "Business development": 14,
  "Team support": 14,
  "Business management": 14,
  "Personal": 14,
};

// ... rest of the full app code from canvas goes here
