import * as esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Build configuration for @repo/lib
const libConfig = {
  entryPoints: [path.resolve(__dirname, '..', '..', 'packages', 'lib', 'src', 'index.ts')],
  outfile: path.resolve(__dirname, '..', '..', 'packages', 'lib', 'dist', 'index.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
};

// Build configuration for the main application
const appConfig = {
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
  plugins: [
    nodeExternalsPlugin({
      allowList: ['@repo/lib']
    }),
    {
      name: 'monorepo-resolver',
      setup(build) {
        build.onResolve({ filter: /^@repo\/lib$/ }, args => {
          const libPath = path.resolve(__dirname, '..', '..', 'packages', 'lib', 'dist', 'index.js');
          if (!fs.existsSync(libPath)) {
            return { errors: [{ text: `@repo/lib build output not found at ${libPath}` }] };
          }
          return { path: libPath };
        });
      },
    },
  ],
};

async function build() {
  try {
    await esbuild.build(libConfig);
    await esbuild.build(appConfig);
    console.log('Main application built successfully');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();