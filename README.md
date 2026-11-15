# VideoText

A small Windows app that puts the same text on one or many videos.

- Add one video or a whole batch. Every video gets the same text.
- Choose where the text goes: **top**, **middle** or **bottom**.
- Each video keeps its original size (resolution) and its audio.
- Pick the text size, color, and an outline or background-box style.
- Light and dark themes. By default the app follows the Windows theme.
- Works fully offline. Your videos never leave your computer.

Exported files are MP4 (H.264) and are saved as `<original name>_text.mp4` in the folder you choose.

## Download

Get the latest version from the [Releases](../../releases) page:

| File | What it is |
| --- | --- |
| `VideoText-Setup-x.y.z.exe` | Installer. Adds VideoText to the Start menu. |
| `VideoText-Portable-x.y.z.exe` | Single file, no install. Just run it. |
| `VideoText.html` | The same app as one web page. Open it in Chrome or Edge. |

The `.exe` files are not code-signed, so Windows SmartScreen may show a warning the first time. Choose **More info → Run anyway**.

## How to use

1. Click **Add videos** (or drag videos into the window).
2. Type your text and pick **Top**, **Middle** or **Bottom**. The preview updates as you type.
3. Click **Export**, choose an output folder, and wait for every video to show **Done**.

## Development

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm start            # run the app
npm run dist         # build the Windows installer and portable exe into dist/
npm run standalone   # build dist/VideoText.html
```

Project layout:

- `app/index.html` – the whole user interface and export logic
- `app/mediabunny.min.js` – bundled [Mediabunny](https://mediabunny.dev) library (video read/encode/write)
- `main.js` – Electron window
- `.github/workflows/release.yml` – builds the Windows release on GitHub

## Publishing a release

1. Update `"version"` in `package.json`.
2. Create and push a matching tag:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

GitHub Actions then builds the Windows files and attaches them to a new release. You can also run the **Windows release** workflow manually from the Actions tab to get the files as a build artifact without publishing a release.

## License

MIT, see [LICENSE](LICENSE). Mediabunny (`app/mediabunny.min.js`) is licensed under the [MPL-2.0](https://mozilla.org/MPL/2.0/).
