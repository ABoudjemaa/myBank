import { pingBackend } from "./pingBackend";
import { expect, test } from "vitest";
import 'dotenv/config';

test("API backend doit répondre avec succès", async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

    console.log('🔍 API_URL =', API_URL);
    expect(await pingBackend()).toBe(true);
});
