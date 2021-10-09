/**
 * @file Test Fixture - ErrnoException
 * @module tests/fixtures/ErrnoException
 */

const EXCEPTION: NodeJS.ErrnoException = new Error('Test errno message')

EXCEPTION.code = 'ERRNO'

export default EXCEPTION
