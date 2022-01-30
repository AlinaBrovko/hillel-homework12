let users = [];

const form = document.querySelector(".form-add-user");
const listUsers = document.querySelector("tbody");
const userInfo = document.querySelector(".user-info");

displaySavedUsers();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = form.elements["name"].value;
  const phone = form.elements["phone"].value;
  const age = form.elements["age"].value;

  const mode = form.getAttribute("data-mode");
  switch (mode) {
    case "add":
      const user = {
        id: generateIdUser(),
        name,
        phone,
        age,
      };

      users.push(user);
      addRowUserToTable(user);
      updateStorage();
      break;
    case "edit":
      const id = +form.getAttribute("data-id");
      const userEdit = {
        id,
        name,
        phone,
        age,
      };
      const indexUser = users.findIndex((user) => user.id === id);
      users.splice(indexUser, 1, userEdit);

      listUsers.innerHTML = "";

      users.forEach((user) => {
        addRowUserToTable(user);
      });

      updateStorage();

      break;
  }
});

listUsers.addEventListener("click", function (e) {
  const target = e.target;
  if (target.classList.contains("btn-view")) {
    const id = +target.closest("tr").getAttribute("data-id");
    const user = users.find((user) => user.id === id);
    if (user) {
      userInfo.innerHTML = JSON.stringify(user);
    }
  }
  if (target.classList.contains("btn-edit")) {
    form.classList.add("open");
    form.setAttribute("data-mode", "edit");
    const id = +target.closest("tr").getAttribute("data-id");
    const user = users.find((user) => user.id === id);
    if (user) {
      form.setAttribute("data-id", user.id);
      form.elements["name"].value = user.name;
      form.elements["phone"].value = user.phone;
      form.elements["age"].value = user.age;
    }
  }
  if (target.classList.contains("btn-delete")) {
    if (!confirm("Are you sure?")) {
      return;
    }
    const id = +target.closest("tr").getAttribute("data-id");

    users = users.filter(function (user) {
      return user.id != id;
    });

    updateStorage();
    listUsers.removeChild(target.closest("tr"));
  }
});

btnAddUser.addEventListener("click", function () {
  form.classList.toggle("open");
  form.setAttribute("data-mode", "add");
});

btnCloseForm.addEventListener("click", function () {
  form.classList.toggle("open");
});

function displaySavedUsers() {
  let savedUser = localStorage.getItem("users");
  if (savedUser) {
    users = JSON.parse(savedUser);
    users.forEach((user) => {
      addRowUserToTable(user);
    });
  }
}

function updateStorage() {
  localStorage.setItem("users", JSON.stringify(users));
}

function generateIdUser() {
  let id;
  if (users.length === 0) {
    id = 1;
  } else {
    id = users[users.length - 1].id + 1;
  }
  return id;
}

function addRowUserToTable(user) {
  listUsers.insertAdjacentHTML(
    "beforeend",
    '<tr data-id="' +
      user.id +
      '">' +
      "<td>" +
      user.id +
      "</td>" +
      "<td>" +
      user.name +
      "</td>" +
      "<td>" +
      user.phone +
      "</td>" +
      "<td>" +
      user.age +
      "</td>" +
      "<td>" +
      '<button class="btn-view">View</button>' +
      '<button class="btn-edit">Edit</button>' +
      '<button class="btn-delete">Delete</button>' +
      "</td>" +
      "</tr>"
  );
}
