'use strict';

(function () {

  let myTodoList = [];

  function createTodoItemForm() {
    let form = createItem('input-group mb-3', '', 'form');
    let input = createItem('form-control', '', 'input');
    let buttonWrapper = createItem('input-group-append', '', 'div');
    let button = createItem('btn btn-primary', 'Добавить дело', 'button');

    input.placeholder = 'Введите название нового дела:';
    button.setAttribute('disabled', 'true');

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    function submitButtonUnlock() {
      if (!input.value) {
        button.setAttribute('disabled', 'true');
      } else {
        button.removeAttribute('disabled');
      };
    };

    input.addEventListener('input', submitButtonUnlock);

    return {
      form,
      input,
      button,
    };
  };

  function createItem(classes = '', text = '', element = 'div') {
    let item = document.createElement(element);
    item.setAttribute('class', classes)
    item.textContent = text;
    return item;
  }

  function createTodoItem(name, listName) {

    let item = createItem('list-group-item d-flex justify-content-between align-items-center', name, 'li');

    let buttonGroup = createItem('btn-group btn-group-sm', '', 'div');
    let doneButton = createItem('btn btn-success', 'Готово', 'button');
    let deleteButton = createItem('btn btn-danger', 'Удалить', 'button');

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      if (item.classList.contains('list-group-item-success')) {
        myTodoList[findItem(myTodoList, 'title', listName + '\\' + item.textContent.replace('ГотовоУдалить', ''))].done = true;
        toLocal(listName);
      } else {
        myTodoList[findItem(myTodoList, 'title', listName + '\\' + item.textContent.replace('ГотовоУдалить', ''))].done = false;
        toLocal(listName);
      };
    });
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        myTodoList.splice(findItem(myTodoList, 'title', listName + '\\' + item.textContent.replace('ГотовоУдалить', '')), 1);
        toLocal(listName);
      };
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  };

  function createTodoApp(sandbox, title = 'Список дел', listName) {

    console.log(myTodoList);

    let todoAppTitle = createItem('', title, 'h2');
    let todoItemForm = createTodoItemForm();
    let todoList = createItem('list-group', '', 'ul');

    sandbox.append(todoAppTitle);
    sandbox.append(todoItemForm.form);
    sandbox.append(todoList);

    todoItemForm.form.addEventListener('submit', function (e) {

      e.preventDefault();

      let todoItem = createTodoItem(todoItemForm.input.value, listName);

      let newItem = {};
      newItem.title = listName + '\\' + todoItem.item.textContent.replace('ГотовоУдалить', '');
      newItem.done = false;

      todoList.append(todoItem.item);
      myTodoList.push(newItem);
      toLocal(listName);

      todoItemForm.input.value = '';
      todoItemForm.button.setAttribute('disabled', 'true');
    });

    if (localStorage[listName.toString()] != undefined && JSON.parse(localStorage[listName.toString()]).length != 0) {
      let list = JSON.parse(localStorage[listName.toString()]);
      for (let i = 0; i < list.length; i++) {
        let item = createTodoItem(list[i].title.replace([listName] + '\\', ''), listName).item;
        todoList.append(item);
        myTodoList.push(list[i]);
        if (list[i].done === true) {
          item.classList.add('list-group-item-success');
        };
      };
    };
  };

  function toLocal(listName) {
    localStorage.setItem([listName.toString()], JSON.stringify(myTodoList));
    let list = JSON.parse(localStorage[listName.toString()]);
    console.log(list);
  };

  function findItem(array, prop, value) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][prop] === value) {
        return i;
      };
    };
  };

  window.createTodoApp = createTodoApp;

})();
