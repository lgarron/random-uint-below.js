import { build } from "esbuild";

build({
  entryPoints: ["./src/random-uint-below/index.js"],
  outfile: "./dist/esm/index.js",
  bundle: true,
  format: "esm",
  target: "es2020",
});

build({
  entryPoints: ["./src/random-uint-below/global.js"],
  outfile: "./dist/esm-global/global.js",
  bundle: true,
  format: "esm",
  target: "es2020",
});
