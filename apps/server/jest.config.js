export default {
	preset: "ts-jest",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.d.ts",
		"!src/database/seeders/**",
		"!src/index.ts",
	],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transform: {
		"^.+\\.ts$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts"],
	moduleFileExtensions: ["ts", "js", "json", "node"],
	verbose: true,
};
