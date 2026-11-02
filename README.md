# CliniPack prototype

A clickable prototype of the CliniPack approval workflow. It is plain HTML, CSS and JavaScript. React and Babel load from a CDN, so there is no build step.

## Run it

The scripts are separate files, so the browser has to load them from a web server. Opening `index.html` by double-clicking it won't work.

```
cd "cpt prototype"
python -m http.server 8765 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8765/>. Older links to `CliniPackPrototype.html` redirect to this page.

## Links (hash router)

Each page, request, tab and Setup section has its own link. The browser's Back and Forward buttons work, and you can share a link to an exact screen.

| Link | Screen |
|---|---|
| `#/my-tasks` | My Tasks |
| `#/dashboard` | Dashboard |
| `#/requests` · `#/requests?status=draft` | All Requests (optionally filtered) |
| `#/requests/00021/financial` | One request, on a given tab: `overview`, `templates`, `financial`, `system`, `attachments`, `routing`, `timeline`, `versions`, `cert` |
| `#/new` · `#/drafts/00017` | New procedure, or continue a draft |
| `#/approved` · `#/in-approvals` · `#/notifications` | Lists |
| `#/edit-requests/NF-002` | An edit (amendment) request |
| `#/data-import` · `#/setup` · `#/setup/approvals` | Admin screens (CSCM user) |

The demo user you pick in the top-right switcher is remembered until you close the tab.

## Files

```
index.html                 page shell: loads the libraries, then the app scripts in order
css/app.css                global styles
assets/                    Innomick logo and favicon
js/core/theme.js           colours, fonts and shared style objects
js/data/master-data.js     master lists, users, stages, SLA, edit design
js/data/seed-procedures.js demo requests
js/components/             shared UI: cards, list cards, dropdown (select.js), help & tours
js/app/shell.js            header, sidebar, router, workflow actions
js/pages/                  one file per screen (dashboard, all-requests, new-procedure,
                           procedure-detail, approved/notifications/my-tasks, in-approvals, setup, …)
js/main.js                 mounts the app
```

Script order in `index.html` matters for data, because the seed files build on the master data. Screens and components only run once the app renders, so a new screen file can go anywhere before `js/main.js`.
