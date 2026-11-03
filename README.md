# CliniPack prototype

A clickable prototype of the CliniPack approval workflow, in HTML, CSS and JavaScript (React from a CDN). The source in `js/` uses JSX. A small build step turns it into one plain-JavaScript file, `dist/app.js`, so the page opens in well under a second instead of compiling in the browser on every load.

## Run it

The scripts are separate files, so the browser has to load them from a web server. Opening `index.html` by double-clicking it won't work.

```
cd "cpt prototype"
python -m http.server 8765 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8765/>. Older links to `CliniPackPrototype.html` redirect to this page.

`dist/app.js` is committed, so you can run the prototype without Node.

## Change the code

Edit the files in `js/`, then rebuild `dist/app.js` (needs Node.js; run `npm install` once):

```
npm run build     # build once
npm run watch     # rebuild automatically on every save
```

The build also updates the `?v=` stamp on `dist/app.js` in `index.html`, so a normal refresh picks up the new version.

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
index.html                 page shell: loads React, then dist/app.js
build.mjs                  build script (esbuild): js/ → dist/app.js
dist/app.js                compiled app — generated, do not edit
css/app.css                global styles
assets/                    Innomick logo and favicon
js/core/theme.js           colours, fonts and shared style objects
js/data/master-data.js     master lists, users, stages, SLA, edit design
js/data/seed-procedures.js demo requests
js/components/             shared UI: cards, list cards, dropdown (select.js), SharePoint top bar
                           (suite-bar.js), help & tours
js/app/shell.js            header, sidebar, router, workflow actions
js/pages/                  one file per screen (dashboard, all-requests, new-procedure,
                           procedure-detail, approved/notifications/my-tasks, in-approvals, setup, …)
js/main.js                 mounts the app
```

A new file must be added to the `FILES` list in `build.mjs`. Order matters for data, because the seed files build on the master data. Screens and components only run once the app renders, so a new screen file can go anywhere before `js/main.js`.
