import fs from 'fs'
import { FILENAME } from './trext-file-result.fixture'

/**
 * @file Test Fixture - Stats
 * @module tests/fixtures/Stats
 */

export default fs.statSync(FILENAME)
