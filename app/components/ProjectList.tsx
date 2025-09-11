import type { ReactNode } from "react";
import { getProjects } from "../../server-fetch/projects";

export default async function ProjectList(): Promise<ReactNode> {
    const projects = await getProjects();
    if (!projects?.length) {
        return <div className="text-gray-400">No projects found.</div>;
    }
    return (
        <ul className="w-full mt-4 space-y-3">
            {projects.slice(0, 4).map((project) => (
                <li key={project.id} className="bg-white/20 rounded-lg px-6 py-4 shadow hover:bg-purple-900/30 transition text-lg font-medium">
                    {project.name}
                </li>
            ))}
        </ul>
    );
}
