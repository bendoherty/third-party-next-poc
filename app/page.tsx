

import { cookies } from "next/headers";
import ProjectList from "./components/ProjectList";

function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  try {
    // JWT tokens are base64 encoded: header.payload.signature
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
    return {
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const token = cookies().get("datasite_token")?.value;
  const user = getUserFromToken(token);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white font-sans">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-12 flex flex-col items-center max-w-lg w-full">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight text-center drop-shadow-lg">
          {user ? (
            <>
              Hello, <span className="text-purple-400">{user.firstName} {user.lastName}</span>
            </>
          ) : (
            "Hello, Guest"
          )}
        </h1>
        <p className="text-lg text-gray-200 mb-8 text-center">
          What project would you like to work on today?
        </p>
        <ProjectList token={token} />
      </div>
    </div>
  );
}
