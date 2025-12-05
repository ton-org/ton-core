const SINGLETHREADED =
    process.env.SINGLETHREADED === "1" || process.env.SINGLETHREADED === "true";

/**
 * @type {import('jest').Config}
 */
const config = {
    transform: {
        "^.+\\.ts": "@swc/jest",
    },
    testEnvironment: "node",
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

if (SINGLETHREADED) {
    /** setting value to undfined throws */
    config.maxWorkers = 1;
}

module.exports = config;
