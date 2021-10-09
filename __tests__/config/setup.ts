import { jest } from '@jest/globals'

/**
 * @file Test Configuration - Setup
 * @module tests/config/setup
 * @see https://jestjs.io/docs/configuration#setupfiles
 */

// Async callbacks must be invoked within 10 seconds
jest.setTimeout(10_000)
