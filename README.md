# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Galeria Butcher i Cloudinary

Galeria działa na hostingu statycznym i pokazuje po dziewięć zdjęć. Pierwszy
zestaw pochodzi z projektu. Kolejne zestawy zawierają zdjęcia z Cloudinary,
od najnowszego.

1. Skonfiguruj osobne środowisko Cloudinary na publiczne zdjęcia Butcher.
2. W **Settings → Security** odblokuj **Resource list** w **Restricted image
   types**. Umożliwi to publiczne odczytywanie list zdjęć według tagu.
3. Wpisz publiczne **Cloud name** w `public/gallery.config.json` i wdróż
   stronę. W gotowym buildzie plik nazywa się `dist/gallery.config.json`.
4. Dodawaj zdjęcia JPG, PNG, WebP lub AVIF w **Media Library** i nadawaj im tag
   `butcher-gallery`. Ten tag publikuje zdjęcie w galerii. Lista może odświeżać
   się z opóźnieniem około minuty. Prześlij zdjęcia bez danych prywatnych,
   ponieważ lista zasobów i obrazy są publiczne.

Przy własnej polityce CSP dodaj `https://res.cloudinary.com` do `img-src`
oraz `connect-src`. Do wyświetlania galerii wystarcza publiczna nazwa
środowiska, bez klucza API. Galeria pokazuje zdjęcia z projektu również
przed uzupełnieniem konfiguracji lub przy niedostępności Cloudinary.

Na nowym hostingu opublikuj katalog `dist`. Dla adresu `/galeria` skonfiguruj
obsługę tras SPA przez `index.html`, jeśli hosting nie robi tego automatycznie.
