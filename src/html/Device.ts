const regex = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini", "i");
const deviceType = regex.test(navigator.userAgent) ? "mobile" : "desktop";

export const device = {
    browser: {
        name: navigator.appCodeName,
        version: navigator.appVersion,
    },
    device: deviceType,
    innerWindow: {
        height: window.innerHeight,
        width: window.innerWidth,
    },
    languages: () => navigator.languages,
    outerWindow: {
        height: window.outerHeight,
        width: window.outerWidth,
    },
    platform: () => navigator.platform,
    userAgent: () => navigator.userAgent,
};
