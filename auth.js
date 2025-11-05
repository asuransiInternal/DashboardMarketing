// auth.js — versi JSONP untuk komunikasi dengan GAS tanpa CORS

const DEPLOY_URL = "https://script.google.com/macros/s/AKfycbxrWR_zLb5Uw256bgzXZm9oA8Mw3lhyOJRtPq_ZP9z7El6fb-OoDkgrMBvV_E4F0FpI/exec";

function apiGet(action, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = "cb_" + Math.random().toString(36).substr(2, 9);
    window[callbackName] = function (response) {
      resolve(response);
      delete window[callbackName];
      script.remove();
    };

    const query = new URLSearchParams({ ...params, action, callback: callbackName });
    const script = document.createElement("script");
    script.src = `${DEPLOY_URL}?${query.toString()}`;
    script.onerror = () => {
      reject("Network error");
      delete window[callbackName];
    };
    document.body.appendChild(script);
  });
}
