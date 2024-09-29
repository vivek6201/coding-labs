import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const appConfig = {
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  plugins: [nodeExternalsPlugin()],
};

const build = async () => {
  try {
    await esbuild.build(appConfig);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

build();