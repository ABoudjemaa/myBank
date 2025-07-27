const API_URL = process.env.NEXT_PUBLIC_API_BASE_TEST_URL || '' ;

export async function pingBackend(): Promise<boolean> {
    try {
        const res = await fetch(API_URL);
        return res.ok;
    } catch {
        return false;
    }
}
