/* eslint-env node */

import {nodeResolve} from '@rollup/plugin-node-resolve';
import Replace from '@rollup/plugin-replace';
import Terser from '@rollup/plugin-terser';
import Typescript from '@rollup/plugin-typescript';
import Autoprefixer from 'autoprefixer';
import Postcss from 'postcss';
import Cleanup from 'rollup-plugin-cleanup';
import {compile as sassCompile} from 'sass';

async function compileCss() {
	const compiled = sassCompile('src/sass/plugin.scss', {
		style: 'compressed',
		silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
	});

	const result = await Postcss([Autoprefixer]).process(compiled.css, {
		from: undefined,
	});
	return result.css.replace(/'/g, "\\'").trim();
}

function getPlugins(css, shouldMinify) {
	const plugins = [
		Typescript({
			tsconfig: 'tsconfig.json',
		}),
		nodeResolve(),
		Replace({
			__css__: css,
			preventAssignment: false,
		}),
	];
	if (shouldMinify) {
		plugins.push(Terser());
	}
	return [
		...plugins,
		// https://github.com/microsoft/tslib/issues/47
		Cleanup({
			comments: 'none',
		}),
	];
}

export default async () => {
	const production = process.env.BUILD === 'production';
	const postfix = production ? '.min' : '';

	const distName = 'tweakpane-plugin-file-import';
	const css = await compileCss();
	return {
		input: 'src/index.ts',
		external: ['tweakpane', '@tweakpane/core'],
		output: {
			file: `dist/${distName}${postfix}.js`,
			format: 'esm',
			globals: {
				tweakpane: 'Tweakpane',
			},
		},
		plugins: getPlugins(css, production),

		// Suppress `Circular dependency` warning
		onwarn(warning, rollupWarn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			rollupWarn(warning);
		},
	};
};
