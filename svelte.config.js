import autoPreprocess from 'svelte-preprocess';

export const preprocess = function (dev) {
    return autoPreprocess({
        sourcemap: dev,
    });
};
