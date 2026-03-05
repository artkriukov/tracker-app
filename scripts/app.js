'use strict';

let habbits = []
const HABBIT_KEY = "HABBIT_KEY"

const page = {
  menu: document.querySelector('.menu__list')
}

// utils 
function loadData() {
  const habbitString = localStorage.getItem(HABBIT_KEY)
  const habbitArray = JSON.parse(habbitString)

  if (Array.isArray(habbitArray)) {
    habbits = habbitArray
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits))
}

// render
function rerenderMenu(activeHabbit) {
  if (!activeHabbit) {
    return
  }

  for(const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`)
    if (!existed) {
      const el = document.createElement('button')
      el.setAttribute('menu-habbit-id', habbit.id)
      el.classList.add('menu__item')
      el.addEventListener('click', () => rerender(habbit.id))
      el.innerHTML = `<img src="../images/${habbit.icon}.svg" alt="${habbit.name}" />`
      if (activeHabbit.id === habbit.id) {
        el.classList.add('menu__item_active')
      }
      page.menu.appendChild(el)
      continue
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add('menu__item_active')
    } else {
      existed.classList.remove('menu__item_active')
    }
  }
}

function rerender(activeHabbitId) {
  const activeHabbit = habbits.find(h => h.id === activeHabbitId)
  rerenderMenu(activeHabbit)
}

// init
(() => {
  loadData()
  rerender(habbits[0].id)
})()