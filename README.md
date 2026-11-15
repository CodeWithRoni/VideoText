# VideoText

A small Windows app that puts the same text on one or many videos.

- **Batch:** add one video or many. Every video gets the same text and keeps its original size (resolution) and audio.
- **Position:** top, middle or bottom, left / center / right, or drag the text anywhere in the preview.
- **Fonts and style:** any font installed on your PC, bold, italic, size, color, outline (color and thickness), shadow, background box (color and opacity).
- **Several texts and a logo:** add more than one text, plus a logo or watermark image.
- **Timing:** show a text for the whole video or only between two times, with fade in and fade out.
- **Export settings:** quality (same as original, high, medium, small file) and an optional file name. Type `TRACK` and the videos are saved as `TRACK-1.mp4`, `TRACK-2.mp4`, …
- **Finishing touches:** time-left estimate, "Open folder" when done, light and dark themes, automatic updates for the installed version.
- Works fully offline. Your videos never leave your computer.

Exported files are MP4 (H.264). If you leave the file name empty they are saved as `<original name>_text.mp4` in the folder you choose. Existing files are never overwritten.

## Download

Get the latest version from the [Releases](../../releases) page:

| File | What it is |
| --- | --- |
| `VideoText-Setup-x.y.z.exe` | Installer. Adds VideoText to the Start menu. |
| `VideoText-Portable-x.y.z.exe` | Single file, no install. Just run it. |
| `VideoText.html` | The same app as one web page. Open it in Chrome or Edge. |

The `.exe` files are not code-signed, so Windows SmartScreen may show a warning the first time. Choose **More info → Run anyway**.

## How to use

1. Add your videos (click the drop area or drag videos into the window). Use **+ Add videos** at the top to add more.
2. Type your text and pick **Top**, **Middle** or **Bottom**, or drag it in the preview. Use **+ Text** and **+ Logo** for more layers.
3. Click **Export**, choose an output folder, and wait for every video to show **Done**.

When several videos are loaded, timing is in seconds from the start of each video, and sizes scale with each video's width.

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
- `main.js`, `preload.js` – Electron window, file saving, automatic updates
- `.github/workflows/release.yml` – builds the Windows release on GitHub

## Publishing a release

1. Update `"version"` in `package.json`.
2. Create and push a matching tag:

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

GitHub Actions then builds the Windows files and attaches them to a new release. Installed copies of VideoText check that release on start-up and update themselves (the portable exe and `VideoText.html` do not auto-update). You can also run the **Windows release** workflow manually from the Actions tab to get the files as a build artifact without publishing a release.

## License

MIT, see [LICENSE](LICENSE). Mediabunny (`app/mediabunny.min.js`) is licensed under the [MPL-2.0](https://mozilla.org/MPL/2.0/).
