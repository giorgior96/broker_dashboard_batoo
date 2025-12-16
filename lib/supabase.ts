import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Boat {
    id: string;
    builder: string;
    model: string;
    year_built: number;
    length: number;
    price_eur: number;
    country: string;
    vat_status: string;
    is_sold: boolean;
    image_url: string;
    navinet_updated_at: string;
    last_seen_at: string;
}

export async function getBoats() {
    console.log("Fetching boats from Supabase...");
    const { data, error } = await supabase
        .from("boats")
        .select("*")
        .order("last_seen_at", { ascending: false });

    if (error) {
        console.error("Error fetching boats:", error);
        return [];
    }
    console.log(`Fetched ${data?.length} boats successfully.`);
    return data as Boat[];
}

export async function getPriceHistory(boatId: string) {
    const { data, error } = await supabase
        .from("price_history")
        .select("*")
        .eq("boat_id", boatId)
        .order("recorded_at", { ascending: true });

    if (error) {
        console.error("Error fetching history:", error);
        return [];
    }
    return data;
}
