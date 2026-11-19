# CodeCaption

A small Windows app that puts a unique caption with your referral code on each video.

- Type your referral code and add one or more videos.
- Click **Generate**: every video gets its own caption from a built-in list of 20,000. A caption is used only once, ever (the app remembers used captions on this computer).
- The caption is shown on the video (the code in yellow), used as the file name, and can be copied as the video title with **Copy title**.
- Each video gets its own caption colors (11 looks: outlined text or a colored box, the code in its own color) and its caption at a different height on the screen (top, upper middle, middle, lower…), picked at random. Drag the caption in the preview to move it on that video.
- Click **Export** and choose a folder. Existing files are never overwritten.
- Each file gets its own details (metadata): title = its caption, comment = the referral code and source file name, creation time = when it was exported, encoder = CodeCaption.

Works fully offline. Exported files are MP4 (H.264) at the original size, with the original audio.

## Changing the caption list

Edit the building blocks in `scripts/make-captions.js`, then run `npm run captions` to rebuild `app/captions.js`.
`{CODE}` in a caption is replaced with the code typed in the app.

## Development

Requires Node.js 20 or newer.

```bash
npm install
npm start            # run the app
npm run dist         # build the Windows installer and portable exe into dist/
npm run standalone   # build dist/CodeCaption.html (runs in Chrome or Edge)
```

Pushing a tag such as `v1.0.0` to GitHub builds the Windows files with GitHub Actions and attaches them to a release.

## License

MIT, see [LICENSE](LICENSE). Mediabunny (`app/mediabunny.min.js`) is licensed under the MPL-2.0.
