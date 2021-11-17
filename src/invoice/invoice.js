const Remote = require('@electron/remote');
const {insert} = require("../database");

const form = document.getElementById('invoice-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!e.target) {
    console.error('No form values provided');
    return;
  }

  const items = {};
  for (const element of e.target) {

    if (!element.name) continue;

    items[element.name] = element.value;
  }

  insert({
    table: 'invoice',
    ...items,
    callback: err => {

      if (err) {
        console.error('An error occurred inserting ', items, ' into invoice:\n', err);
        return;
      }

      console.log('Generate PDF...');

    },
  });

  Remote.getCurrentWindow().close();
});
