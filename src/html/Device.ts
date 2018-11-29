const regex = new RegExp('Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini', 'i');
const device = regex.test(navigator.userAgent) ? 'mobile' : 'desktop';

export default {
  device,
  innerWindow: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  outerWindow: {
    width: window.outerWidth,
    height: window.outerHeight,
  },
  languages: () => navigator.languages,
  browser: {
    name: navigator.appCodeName,
    version: navigator.appVersion,
  },
  platform: () => navigator.platform,
  userAgent: () => navigator.userAgent,
};
