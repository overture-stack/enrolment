/*
* Requires a "config.js" file in this directory
* from which it reads a one-level deep config object
*/

import config from './config';

/**
 * Returns a single config value
 * @param {String} key - key to return from config options
 * @returns {Object} - key/val pair from config
 */
export function getOneConfig(key) {
    return { [key] : config[key] };
}

/**
 * Returns an object containing key/val pairs from config
 * @param {array} keys - keys to return from config
 * @returns {Object} - object containing key/val pairs from config
 */
export function getConfigs(keys) {
    return keys.reduce((prev, curr) => {

        // Gaurd against no key present in config
        if (!(curr in config))
            return prev;

        return {
            ...prev,
            [curr]: config[curr]
        };
    }, {})
}