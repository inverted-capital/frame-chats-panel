# starter-widget

This repo demonstrates a minimal setup for building an Artifact widget. It loads
and saves a custom `profile.json` file checked against a Zod schema. If the file
is missing a default one is written automatically.

## Development

```bash
npm run dev
```

## Building

```bash
npm run build
```

Load `dist/index.html` in an `ArtifactFrameHolder` to embed the widget inside
another application.

### Data shape

The profile data is defined in `src/types/account.ts`:

```ts
export const accountDataSchema = z.object({
  name: z.string()
})
```

The widget exposes a single input that edits this value and saves it back to
`profile.json`.
