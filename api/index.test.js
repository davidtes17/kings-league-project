import { unstable_dev } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev(
			"api/index.js",
			{},
			{ disableExperimentalWarning: true }
		);
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("Routes should have enpoint and description", async () => {
		const resp = await worker.fetch();
		if (resp) {
			const apiRoutes = await resp.json()
			apiRoutes.forEach((endpoint) => {
				expect(endpoint).toHaveProperty('endpoint')
				expect(endpoint).toHaveProperty('description')
			})
		}
	});
});
