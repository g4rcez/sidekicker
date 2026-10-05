import { defineConfig } from "vite-plus";

export default defineConfig({
    fmt: {
        printWidth: 120,
        tabWidth: 4,
        useTabs: false,
        singleQuote: false,
        arrowParens: "always",
        trailingComma: "all",
    },
    lint: {
        ignorePatterns: ["dist/**"],
        options: {
            typeAware: true,
            typeCheck: true,
        },
    },
    test: {
        include: ["tests/**/*.test.ts"],
        environment: "node",
        coverage: {
            include: ["src/**/*.ts"],
            exclude: ["src/types/**/*.ts"],
            reporter: ["text", "lcov"],
            thresholds: {
                statements: 95,
                branches: 90,
                functions: 95,
                lines: 95,
            },
        },
    },
    pack: {
        entry: ["src/index.ts"],
        format: ["esm", "cjs"],
        dts: true,
        clean: true,
        sourcemap: true,
        platform: "neutral",
        target: "es2024",
    },
});
