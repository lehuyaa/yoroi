const { join } = require('path');
const config = require('./wdio.shared.local.appium.conf');

// ============
// Specs
// ============
config.specs = [
    './test/specs/**/*.js',
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        platformName: 'Android',
        'appium:deviceName': 'Pixel_5',
        'appium:appWaitActivity': 'com.emurgo.*',
        'appium:orientation': 'PORTRAIT',
        'appium:automationName': 'UiAutomator2',
        'appium:app': join(process.cwd(), '/test/app/Yoroi-Nightly.apk'),
    }
]

exports.config = config;