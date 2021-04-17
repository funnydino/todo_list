'use strict';

(function () {

  // в этой переменной будет находиться массив из объектов списка дел
  let myTodoList = [];

  // создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  };

  // создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела:';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.setAttribute('disabled', 'true');

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // добавляем слушатель события 'input' на текстовое поле
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

  // создаём и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };

  // создаём поле для нового дела
  function createTodoItem(name, listName) {

    let item = document.createElement('li');

    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // добавляем обработчики событий на кнопки
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      if (item.classList.contains('list-group-item-success')) {
        myTodoList[findItem(myTodoList, 'title', listName + '\\' + item.textContent.replace('ГотовоУдалить', ''))].done = true;
        toLocal(listName);
        console.log(myTodoList);
      } else {
        myTodoList[findItem(myTodoList, 'title', listName + '\\' + item.textContent.replace('ГотовоУдалить', ''))].done = false;
        toLocal(listName);
        console.log(myTodoList);
      };
    });
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        myTodoList.splice(findItem(myTodoList, 'title', listName + '\\' + item.textContent.replace('ГотовоУдалить', '')), 1);
        toLocal(listName);
      };
    });

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  };

  function createTodoApp(sandbox, title = 'Список дел', listName) {

    console.log(myTodoList);

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    sandbox.append(todoAppTitle);
    sandbox.append(todoItemForm.form);
    sandbox.append(todoList);

    // браузер создаёт событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {

      // эта строчка необходима, чтобы предотвратить стандартные действия браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввёл в поле
      // (нет необходимости, так как висит слушатель события 'input' на поле для ввода)
      // if (!todoItemForm.input.value) {
      //   return;
      // }

      let todoItem = createTodoItem(todoItemForm.input.value, listName);

      let newItem = {};
      newItem.title = listName + '\\' + todoItem.item.textContent.replace('ГотовоУдалить', '');
      newItem.done = false;

      /*
      // добавляем обработчики событий на кнопки
      todoItem.doneButton.addEventListener('click', function () {
        todoItem.item.classList.toggle('list-group-item-success');
        if (todoItem.item.classList.contains('list-group-item-success')) {
          myTodoList[findItem(myTodoList, 'title', todoItem.item.textContent)].done = true;
          toLocal(listName);
        } else {
          myTodoList[findItem(myTodoList, 'title', todoItem.item.textContent)].done = false;
          toLocal(listName);
        };
      });
      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          myTodoList.splice(findItem(myTodoList, 'title', todoItem.item.textContent), 1);
          toLocal(listName);
        };
      });
      */

      // создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);
      myTodoList.push(newItem);
      toLocal(listName);

      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = '';
      todoItemForm.button.setAttribute('disabled', 'true');
    });

    // при запуске, проверяем длину массива myTodoList, и если элементов в массиве больше 
    // ноля - восстанавливаем список дел из localStorage
    let list = JSON.parse(localStorage[listName.toString()]);
    if (list.length > 0) {
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
    // let list = JSON.parse(localStorage[listName.toString()]);
    // console.log(list);
    // return list;
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

/*

  // Задание #1. Таймер:

  let timerInput = document.querySelector('.timer-input');
  let timerStartBtn = document.querySelector('.timer-button');
  let timerDisplay = document.querySelector('.timer-block');
  let timerStart = null;

  timerStartBtn.addEventListener('click', function () {
    clearInterval(timerStart);
    let timerDuration = parseInt(timerInput.value);
    timerStart = setInterval(function () {
      timerDisplay.textContent = timerDuration--;
      if (timerDuration < 0) {
        clearInterval(timerStart);
      };
    }, 1000);
  });

  // Задание #2. Повторяющийся текст:

  let sandbox = document.querySelector('.sandbox');
  let textInput = document.createElement('input');
  let textRepeat = document.createElement('h2');
  sandbox.append(textInput);
  sandbox.append(textRepeat);
  textInput.classList.add('text-input');
  textRepeat.classList.add('text-repeat');
  textInput.setAttribute('placeholder', 'Введите текст...');
  let latencyRepeat;

  function duplicateText() {
    clearTimeout(latencyRepeat);
    latencyRepeat = setTimeout(function () {
      textRepeat.textContent = textInput.value;
    }, 300);
  };

  textInput.addEventListener('input', duplicateText);

  // timerStartBtn.addEventListener('click', function () {
  //   timerDuration = parseInt(timerInput.value);
  // });

  // let timer = setInterval(function () {
  //   if (timerDuration < 0) {
  //     clearInterval(timer);
  //   } else {
  //     timerDisplay = timerDuration;
  //   }
  //   timerDuration--;
  // }, 1000);

  */

/*

let countDisplay = document.querySelector('.count-display');
let incrementButton = document.querySelector('.increment-button');
let colorInput = document.querySelector('.color-input');
let clearButton = document.querySelector('.clear-color-button');
let colorBlock = document.querySelector('.color-block');

function incrementCount() {
  let currentCount = parseInt(countDisplay.textContent);
  countDisplay.textContent = currentCount + 1;
};

function paintBlock() {
  colorBlock.style.backgroundColor = colorInput.value;
};

colorInput.addEventListener('input', paintBlock);

paintBlock();

clearButton.addEventListener('click', function () {
  colorBlock.style.removeProperty('background-color');
  colorInput.value = '';
});

incrementButton.addEventListener('click', incrementCount);

*/