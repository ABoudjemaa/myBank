import { pingBackend } from "./pingBackend";
import { expect, test } from "vitest";

test("API backend doit répondre avec succès", async () => {
    expect(await pingBackend()).toBe(true);
});
