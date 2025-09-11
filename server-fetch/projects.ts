import { cookies } from "next/headers";

type Project = {
    id: string;
    name: string;
    datacenter: string;
    offeringType: string;
    state: string;
    launchState: string;
    subscriptionId: string;
};

export async function getProjects(): Promise<Project[]> {
    const token = (await cookies()).get("datasite_token")?.value;
    if (!token) return [];
    try {
        const res = await fetch("https://api.dev.datasite.com/projects", {
            headers: {
                Authorization: `Bearer ${token}`,
                'x-datasite-api-version': '2024-04-01'
            },
        });
        const data = (await res.json()) as { data: Project[]; };
        return data.data;
    } catch (e) {
        return [];
    }
}