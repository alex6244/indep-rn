/** @type {Detox.DetoxConfig} */
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    // TODO: iOS Detox app configuration is intentionally disabled until
    // real workspace/scheme names are configured for this project.
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: `cd android && ${gradlew} assembleDebug assembleAndroidTest -DtestBuildType=debug`,
      reversePorts: [
        8081
      ]
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: `cd android && ${gradlew} assembleRelease assembleAndroidTest -DtestBuildType=release`
    }
  },
  devices: {
    attached: {
      type: 'android.attached',
      device: {
        adbName: '.*'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: process.env.DETOX_AVD_NAME || 'Pixel_6'
      }
    }
  },
  configurations: {
    'android.att.debug': {
      device: 'attached',
      app: 'android.debug'
    },
    'android.att.release': {
      device: 'attached',
      app: 'android.release'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  }
};
