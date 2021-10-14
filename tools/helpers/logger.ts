import logger from '@flex-development/grease/utils/logger.util'

/**
 * @file Helpers - Logger
 * @module tools/helpers/logger
 */

// ! Fixes: `TypeError: logger is not a function`
// @ts-expect-error Property 'default' does not exist
export default logger.default
