# Seller Catalog

## GLID-based Seller Redirection Flow

The catalog now supports dynamic seller pages based on the URL path.

- Route `/<glid>` loads seller data from `src/data/<glid>.json`.
- Route `/` continues to load the default static dataset from `src/data/sellerData.json`.
- If the JSON file for a GLID does not exist, the UI shows a "Seller not found" state.

## How to Add a New Seller

1. Add a JSON file in `src/data` with file name as the seller GLID, for example `ABCD1234.json`.
2. Open the app with `/<glid>` (example: `/ABCD1234`).
3. The app resolves and renders the matching seller profile automatically.
