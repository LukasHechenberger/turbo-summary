/* global module -- CommonJS */

// Learn more about Turborepo Generators at https://turborepo.com/docs/guides/generating-code

module.exports = function generator(
  /** @type {import('@turbo/gen').PlopTypes.NodePlopAPI} */ plop,
) {
  // A simple generator to add a new React component to the internal UI library
  plop.setGenerator('react-component', {
    description: 'Adds a new react component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}.tsx',
        templateFile: 'templates/component.hbs',
      },
    ],
  });
};
