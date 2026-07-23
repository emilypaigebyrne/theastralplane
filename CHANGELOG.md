# Changelog

Manual log of changes to the Aircraft Tracker app. Newest entries at the top.

Format for each entry:
- **What I added** — the feature/change
- **Bug?** — what broke, if anything
- **Fix** — what solved it

---

## Refresh button
**What I added:** A button to re-fetch aircraft data on demand instead of only loading once on page load.
**Bug?** None logged yet.
**Fix:** —

---

## Cleaner details panel
**What I added:** Restyled the sidebar "Selected Aircraft" card (`.detail-card`, `.detail-row`, etc.) and added a `location` field to the JSON data + detail panel.

**Bug 1:** Restyling the detail card accidentally deleted the `.plane-marker` CSS rule entirely from `style.css` → plane icons disappeared from the map again.
**Fix:** Re-added `.plane-marker` styling to `style.css`.

**Bug 2:** `renderAircraftDetails()` referenced `aircraft.country` and `aircraft.location`, but the JSON only had `origin_country` (no `location` at the time) → those fields always showed "Unknown".
**Fix:** Pointed `country` at `aircraft.origin_country`; temporarily removed the `location` row since no matching data existed yet.

**Bug 3:** After adding `location` to the JSON, the new "Location" row got pasted *after* the closing backtick of the template literal instead of inside it → raw HTML sitting in plain JS, syntax error, entire app crashed (map and all).
**Fix:** Moved the Location `<div>` back inside the template literal and added the missing `location` variable (`formatValue(aircraft.location, "Unknown")`).

---

## Aircraft heading
**What I added:** `heading` field to the sample JSON data, and rotated the plane icon in `addAircraftToMap()` based on heading (`rotation = heading - 45`).
**Bug?** None logged.
**Fix:** —

---

## Plane icons
**What I added:** Replaced default Leaflet pin markers with a custom `L.divIcon` showing a plane emoji (`.plane-marker`).

**Bug 1:** Icons didn't appear at all. `.plane-marker` CSS was accidentally nested inside `@media (max-width: 900px) { }` instead of being a top-level rule, so it only applied on narrow/mobile screens.
**Fix:** Moved `.plane-marker` out to be a normal top-level rule; kept a smaller override inside the media query for mobile.

**Bug 2:** An entire second copy of `addAircraftToMap()` got pasted *inside* the first one (nested function, never called), leaving 3 unclosed braces → syntax error, whole script failed to load (blank map, no markers, console errors).
**Fix:** Removed the broken outer wrapper, kept the working inner version (had the heading/rotation logic), and removed a duplicate `bindPopup()` call left over from the copy-paste.

---

## Initial markers + map
**What I added:** Base Leaflet map, OpenStreetMap tile layer, fetch of `data/sample-aircraft.json`, default markers with popups, and sidebar detail view on click.
**Bug?** None logged.
**Fix:** —
