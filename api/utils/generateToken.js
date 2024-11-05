import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { 
    expiresIn: "15d" 
  });

  // Cookie settings that will work across environments
  const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
    httpOnly: true,                    // Prevent XSS attacks
    sameSite: 'lax',                  // Changed from 'none' to 'lax'
    secure: process.env.NODE_ENV === 'production', // Secure in production
    path: '/',                        // Explicit path
  };

  res.cookie("jwt-netflix", token, cookieOptions);
  return token;
};