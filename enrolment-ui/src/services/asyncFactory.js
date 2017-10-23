/*
* asyncFactory.js
* Factories to create async functions used by services
*/

import axios from "axios";
import { getCSRFToken } from "./utils";

// INTERNAL FUNCTIONS

function createBaseConfig(method, url) {
  return {
    method,
    url,
    credentials: "include"
  };
}

function addCSRF(config) {
  return {
    ...config,
    headers: {
      "X-CSRFToken": getCSRFToken()
    }
  };
}

function addData(config, data) {
  return {
    ...config,
    data
  };
}

// PUBLIC (EXPORTED) FUNCTIONS

/**
 * Returns an Axios function configured by the calling
 * function - if we switch to something other than axios
 * in the future we can swap it out here as long as it 
 * uses standard promises
 * @param {string} method - http verb (GET, POST, PUT, etc)
 * @param {string} url - endpoint url
 * @param {boolean} csrf - attaches "X-CSRFToken" to request headers
 * @param {Object} withData - return function has data param if true
 */
export function asyncServiceCreator(method, url, csrf = false, withData = false) {
  const baseConfig = createBaseConfig(method, url);

  if (csrf && withData) return data => axios(addCSRF(addData(baseConfig, data)));

  if (withData) return data => axios(addData(baseConfig, data));

  if (csrf) return () => axios(addCSRF(baseConfig));

  return () => axios(baseConfig);
}

/**
 * Returns a promise that resolves with the provided
 * object or array after the provided delay to simulate
 * an async operation
 * @param {Object|array} returnObj 
 * @param {number} delay 
 */
export function asyncDummyCreator(returnObj, delay) {
  return () => new Promise(resolve => {
    setTimeout(() => resolve(returnObj), delay);
  })
}
