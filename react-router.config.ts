import type { Config } from "@react-router/dev/config";

export default {
  future: {
    v8_middleware: true,
  },
  ssr: true,
  serverBuildFile: "index.js",
} satisfies Config;
