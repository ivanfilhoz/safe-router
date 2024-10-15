import type { Config } from 'jest'

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/*.test.ts'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.ts'],
	watchPathIgnorePatterns: ['<rootDir>/generated/'],
	moduleNameMapper: {
		'^safe-router/helpers$': '<rootDir>/src/helpers',
	},
} satisfies Config
