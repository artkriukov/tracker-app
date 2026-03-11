"use strict";

let habbits = [
  {
    id: 1,
    icon: "sport",
    name: "Отжимания",
    target: 10,
    days: [
      { comment: "Первый подход всегда тяжело" },
      { comment: "второй день проще" },
    ],
  },
  {
    id: 2,
    icon: "food",
    name: "Правильное питание",
    target: 10,
    days: [{ comment: "Круто" }],
  },
];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPrecent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  body: {
    daysContainer: document.getElementById("days"),
    nextDay: document.querySelector('.next__day')
  },
  popup: {
    index: document.getElementById('add-habbit-popup'),
    iconField: document.querySelector('.popup__form input[name="icon"]') 
  }
};

// utils
function loadData() {
  const habbitString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitString);

  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function resetForm(form, fields) {
	for (const field of fields) {
		form[field].value = '';
	}
}

function validateAndGetFormData(form, fields) {
	const formData = new FormData(form);
	const res = {};
	for (const field of fields) {
		const fieldValue = formData.get(field);
		form[field].classList.remove('error');
		if (!fieldValue) {
			form[field].classList.add('error');
		}
		res[field] = fieldValue;
	}
	let isValid = true;
	for (const field of fields) {
		if (!res[field]) {
			isValid = false;
		}
	}
	if (!isValid) {
		return;
	}
	return res;
}

function addHabbit(event) {
	event.preventDefault();
	const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
	if (!data) {
		return;
	}
	const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);
	habbits.push({
		id: maxId + 1,
		name: data.name,
		target: data.target,
		icon: data.icon,
		days: []
	});
	resetForm(event.target, ['name', 'target']);
	togglePopup();
	saveData();
	rerender(maxId + 1);
}

// render
function rerenderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }

  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      const el = document.createElement("button");
      el.setAttribute("menu-habbit-id", habbit.id);
      el.classList.add("menu__item");
      el.addEventListener("click", () => rerender(habbit.id));
      el.innerHTML = `<img src="../images/${habbit.icon}.svg" alt="${habbit.name}" />`;
      if (activeHabbit.id === habbit.id) {
        el.classList.add("menu__item_active");
      }
      page.menu.appendChild(el);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}

function rerenderHeader(activeHabbit) {
  if (!activeHabbit) {
    return;
  }

  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;

  page.header.progressPrecent.innerText = progress.toFixed(0) + " %";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}px`);
}

function rerenderBody(activeHabbit) {
  if (!activeHabbit) {
    return;
  }

  page.body.daysContainer.innerHTML = "";
  const comments = activeHabbit.days;

  comments.forEach((dayComment, index) => {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `
      <div class="habbit__day">День ${index + 1}</div>
      <div class="habbit__comment">${dayComment.comment}</div>
      <button class="habbit__delete" onclick="deleteDay(${index})">
        <img src="./images/delete.svg" alt="delete habbit" />
      </button>
    `;
    page.body.daysContainer.appendChild(element)
  });

  page.body.nextDay.innerText = `День ${comments.length + 1}`
}

function addDays(event) {
  const form = event.target
  event.preventDefault()
  const data = new FormData(form)
  const comment = data.get('comment')
  form['comment'].classList.remove('error')
  if (!comment) {
    form['comment'].classList.add('error')
  }

  habbits = habbits.map((habbit) => {
    if(habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }])
      }
    }
    return habbit
  })

  form['comment'].value = ''
  rerender(globalActiveHabbitId)
  saveData()
}

function deleteDay(index) {
  habbits = habbits.map(habbit => {
    if(habbit.id === globalActiveHabbitId) {
      habbit.days.splice(index, 1)
      return {
        ...habbit,
        days: habbit.days
      }
    }
  return habbit
  })
  rerender(globalActiveHabbitId)
  saveData()
}

function togglePopup() {
  page.popup.index.classList.toggle("cover_hidden")
}

function setIcon(context, icon) {
  page.popup.iconField.value = icon
  const activeIcon = document.querySelector('.icon.icon_active')
  activeIcon.classList.remove('icon_active')
  context.classList.add('icon_active')
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId
  const activeHabbit = habbits.find((h) => h.id === activeHabbitId)
  document.location.replace(document.location.pathname + '#' + activeHabbitId)
  rerenderMenu(activeHabbit);
  rerenderHeader(activeHabbit);
  rerenderBody(activeHabbit);
}

// init
(() => {
	loadData();
	const hashId = Number(document.location.hash.replace('#', ''));
	const urlHabbit = habbits.find(habbit => habbit.id == hashId);
	if (urlHabbit) {
		rerender(urlHabbit.id);
	} else {
		rerender(habbits[0].id);
	}
})()
