import { getBoats } from "@/lib/supabase";
import Dashboard from "@/components/Dashboard";

// This is a Server Component by default
export default async function Page() {
    const boats = await getBoats();

    return (
        <Dashboard initialBoats={boats} />
    );
}
