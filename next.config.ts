
import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const certDir = path.join(__dirname, "certs");
const keyPath = path.join(certDir, "localhost-key.pem");
const certPath = path.join(certDir, "localhost-cert.pem");

const httpsOptions = fs.existsSync(keyPath) && fs.existsSync(certPath)
  ? {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
  : undefined;

const nextConfig: NextConfig = {
  /* config options here */
  ...(httpsOptions && { server: { https: httpsOptions } }),
};

export default nextConfig;
