const { getDefaultConfig } = require("metro-config");
const Platform = require("react-native").Platform;

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig.getDefaultValues(Platform.OS); // This uses the current platform

  return {
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"], // Add any additional file extensions you need
    },
  };
})();
