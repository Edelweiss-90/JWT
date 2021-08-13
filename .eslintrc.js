module.exports = {
    'root': true,
    'parser': '@typescript-eslint/parser',
    'plugins': [
        '@typescript-eslint',
    ],
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    'rules': {
        'indent': ['error', 4],
        'quotes': [2, 'single', { 'avoidEscape': true }],
        'semi': [2, 'always'],
        'max-len': ['error', {'code': 120}],
        'new-cap': ['error', {'newIsCap': false}],
    },
    'parserOptions': {
        'ecmaVersion': 6,
    },
};
