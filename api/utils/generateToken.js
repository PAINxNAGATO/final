import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { 
    expiresIn: "15d" 
  });

  // Cookie settings that match your CORS configuration
  const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days in MS
    httpOnly: true,                     // Prevent XSS attacks
    sameSite: 'none',                   // Allow cross-site requests
    secure: true,                       // Required for sameSite: 'none'
    path: '/',                          // Cookie is available for all paths
    domain: ENV_VARS.NODE_ENV === 'production' 
      ? '.vercel.app'                   // Allow sharing between your vercel domains
      : undefined                       // Use default for localhost
  };

  res.cookie("jwt-netflix", token, cookieOptions);
  return token;
};