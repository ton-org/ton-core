const SINGLETHREADED =
    process.env.SINGLETHREADED === "1" || process.env.SINGLETHREADED === "true";
/** @type {import('jest').Config} */
const options = {
    transform: {
        "^.+\\.ts": "@swc/jest",
    },
    testEnvironment: "node",
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

if (SINGLETHREADED) {
    /** setting value to undfined throws */
    options.maxWorkers = 1;
}

module.exports = options;
