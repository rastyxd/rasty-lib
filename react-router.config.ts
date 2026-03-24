import type { Config } from "@react-router/dev/config";

export default {
  future: {
    v8_middleware: true,
    v8_viteEnvironmentApi: true
  },
  ssr: true,
  serverBuildFile: "index.js",
} satisfies Config;