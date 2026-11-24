import { describe, expect, it } from "vitest";
import { needsReload, parseRecord, pendingPolicies, requiredPolicies, serializeRecord } from "./consent";
import { auditEntries, matchesName } from "./audit";
import { readCookie } from "./cookie";
import { isAllowed } from "./scripts";

const policy = (id: string, category: string) => ({
	id,
	category,
	label: "",
	description: "",
	provider: "",
	location: "",
	privacy: "",
	cookies: [],
	revision: "",
});

describe("parseRecord", () => {
	const revisions = { matomo: "a1", youtube: "b1" };

	it("returns null without a decision", () => {
		expect(parseRecord(undefined, revisions)).toBeNull();
		expect(parseRecord("", revisions)).toBeNull();
	});

	it("returns null for corrupt or foreign values", () => {
		expect(parseRecord("{nope", revisions)).toBeNull();
		expect(parseRecord('{"matomo":true}', revisions)).toBeNull();
		expect(parseRecord('{"consent":"matomo","policies":{}}', revisions)).toBeNull();
		expect(parseRecord('{"consent":[],"policies":["matomo"]}', revisions)).toBeNull();
	});

	it("reads the current format and drops unknown ids", () => {
		expect(
			parseRecord('{"consent":["matomo","removed"],"policies":{"matomo":"a0","youtube":"b1","removed":"c1","bad":1}}', revisions),
		).toEqual({
			consent: ["matomo"],
			policies: { matomo: "a0", youtube: "b1" },
		});
	});

	it("reads cookies written before 1.0", () => {
		expect(parseRecord('["matomo","essential",1]', revisions)).toEqual({ consent: ["matomo"], policies: null });
		expect(parseRecord("[]", revisions)).toEqual({ consent: [], policies: null });
	});

	it("round-trips a serialized record", () => {
		expect(parseRecord(serializeRecord(["youtube"], revisions), revisions)).toEqual({
			consent: ["youtube"],
			policies: revisions,
		});
	});
});

describe("pendingPolicies", () => {
	const revisions = { matomo: "a2", youtube: "b1", osm: "c1" };

	it("lists policies added after the decision", () => {
		expect(pendingPolicies({ consent: ["matomo"], policies: { matomo: "a2", youtube: "b1" } }, revisions)).toEqual({
			added: ["osm"],
			changed: [],
		});
	});

	it("lists granted policies that changed since", () => {
		expect(
			pendingPolicies({ consent: ["matomo"], policies: { matomo: "a1", youtube: "b1", osm: "c1" } }, revisions),
		).toEqual({ added: [], changed: ["matomo"] });
	});

	it("keeps declined policies that changed declined without asking", () => {
		expect(
			pendingPolicies({ consent: [], policies: { matomo: "a1", youtube: "b1", osm: "c1" } }, revisions),
		).toEqual({ added: [], changed: [] });
	});

	it("is empty without a decision or for cookies written before 1.0", () => {
		expect(pendingPolicies(null, revisions)).toEqual({ added: [], changed: [] });
		expect(pendingPolicies({ consent: ["matomo"], policies: null }, revisions)).toEqual({ added: [], changed: [] });
	});
});

describe("needsReload", () => {
	it("skips the reload for a first decline", () => {
		expect(needsReload(null, [])).toBe(false);
	});

	it("reloads when policies are granted or revoked", () => {
		expect(needsReload(null, ["matomo"])).toBe(true);
		expect(needsReload(["matomo"], [])).toBe(true);
		expect(needsReload(["matomo"], ["youtube"])).toBe(true);
	});

	it("skips the reload when nothing changed", () => {
		expect(needsReload(["matomo", "youtube"], ["youtube", "matomo"])).toBe(false);
	});
});

describe("requiredPolicies", () => {
	it("returns the policies of required categories", () => {
		const categories = [
			{ id: "essential", label: "", description: "", required: true },
			{ id: "statistics", label: "", description: "", required: false },
		];
		const policies = [policy("session", "essential"), policy("matomo", "statistics")];
		expect(requiredPolicies(categories, policies)).toEqual(["session"]);
	});
});

describe("isAllowed", () => {
	it("needs every listed policy", () => {
		expect(isAllowed("matomo", ["matomo"])).toBe(true);
		expect(isAllowed(" matomo  youtube ", ["youtube", "matomo"])).toBe(true);
		expect(isAllowed("matomo youtube", ["matomo"])).toBe(false);
	});

	it("never allows scripts without a policy", () => {
		expect(isAllowed("", ["matomo"])).toBe(false);
		expect(isAllowed(null, ["matomo"])).toBe(false);
	});
});

describe("readCookie", () => {
	it("reads values written by js-cookie in earlier versions", () => {
		expect(readCookie("cc_policies", 'a=1; cc_policies=[%22matomo%22]; b=2')).toBe('["matomo"]');
	});

	it("ignores malformed cookies", () => {
		expect(readCookie("cc_policies", "bad=%E0%A4%A; cc_policies=[]")).toBe("[]");
		expect(readCookie("missing", "a=1")).toBeUndefined();
	});
});

describe("matchesName", () => {
	it("matches exact names and * wildcards", () => {
		expect(matchesName("cc_policies", "cc_policies")).toBe(true);
		expect(matchesName("_pk_id.*", "_pk_id.1.a2b3")).toBe(true);
		expect(matchesName("_ga*", "_ga_ABC123")).toBe(true);
		expect(matchesName("_pk_id.*", "_pk_idx")).toBe(false);
		expect(matchesName("cc_policies", "cc_policies_old")).toBe(false);
	});

	it("never matches an empty pattern", () => {
		expect(matchesName(" ", "")).toBe(false);
	});
});

describe("auditEntries", () => {
	const policies = [
		{ ...policy("consent", "essential"), cookies: [{ name: "cc_policies", duration: "" }] },
		{ ...policy("matomo", "statistics"), cookies: [{ name: "_pk_*", duration: "" }] },
	];

	it("flags undeclared values and values of policies without consent", () => {
		const found = [
			{ name: "cc_policies", storage: "cookie" as const },
			{ name: "_pk_id.1", storage: "cookie" as const },
			{ name: "tracker", storage: "localStorage" as const },
		];
		expect(auditEntries(found, policies, ["consent"])).toEqual([
			{ name: "cc_policies", storage: "cookie", policy: "consent", status: "ok" },
			{ name: "_pk_id.1", storage: "cookie", policy: "matomo", status: "without consent" },
			{ name: "tracker", storage: "localStorage", policy: null, status: "undeclared" },
		]);
	});
});
