# NeuroWeb

NeuroWeb is a visual second brain that maps thoughts and their connections in an interactive network.

## Features (v1)

- Add thoughts with title, short description, and optional tag.
- View all thoughts as a glowing interactive graph.
- Connect any two thoughts with links.
- Click a node to inspect thought details.
- Jump to a random thought using the exploration button.
- Data persists in browser `localStorage`.

## Tech Stack

- HTML
- CSS
- JavaScript
- [vis-network](https://visjs.github.io/vis-network/) for graph visualization

## Run locally

Open `index.html` in your browser.

For a lightweight local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
