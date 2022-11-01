import './common/style.scss';

const apps = process.env.APPS;

const ul = document.createElement("ul");

for (const app of apps) {
  const li = document.createElement("li");
  const link = document.createElement("a");
  link.href = "./" + app;
  link.textContent = app.replace(/-/g, " ");
  li.appendChild(link);
  ul.appendChild(li);
}

document.body.appendChild(ul);
