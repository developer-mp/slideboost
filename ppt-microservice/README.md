# PPT Microservice (Custom Engine)

This is a standalone microservice that generates `.pptx` files from plain text.

It does **not** use PowerPoint generation libraries. Instead, it:

1. Converts your input text into a title and bullet slides
2. Writes Open XML files manually (`ppt/slides/*.xml`, `ppt/presentation.xml`, etc.)
3. Packages everything into a valid `.pptx` ZIP container

## API

- `GET /health`
- `POST /v1/presentations`
- `GET /v1/presentations/:id/download`

### Create a presentation

`POST /v1/presentations`

Request body:

```json
{
  "title": "Quarterly Product Update",
  "text": "SlideBoost launched a desktop app...",
  "maxBulletsPerSlide": 5,
  "maxWordsPerBullet": 14
}
```

Response:

```json
{
  "id": "5f9f2668-c919-4f57-9041-3f9629e4f7f5",
  "fileName": "presentation-5f9f2668-c919-4f57-9041-3f9629e4f7f5.pptx",
  "downloadUrl": "/v1/presentations/5f9f2668-c919-4f57-9041-3f9629e4f7f5/download",
  "slideCount": 4
}
```

## Local run

```bash
yarn install
yarn dev
```

Service default port: `4010`

Set port:

```bash
set PPT_SERVICE_PORT=4010
yarn dev
```

## Notes

- Generated files are stored in `output/`.
- This service is independent from the main `server/` app.
