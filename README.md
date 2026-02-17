# Arcstack

[![Create Arcstack][i1]][l1]
[![Downloads][d1]][l1]

A framework-agnostic backend starter kit for modern TypeScript servers.

Arcstack provides a structured foundation for building APIs with Express, H3, and future runtimes — without locking your application to a single framework.

It prioritizes architecture first, framework second.

---

## Why Arcstack?

Most starter kits are tightly coupled to one framework. Arcstack is designed around clean architecture and transport-layer abstraction.

- Multi-framework support (Express, H3 — more coming)
- Opinionated but not restrictive
- Clean and scalable folder structure
- TypeScript native
- Structured error handling
- Standardized API responses
- Easy to extend

Your business logic remains independent of the HTTP runtime.

---

## Quick Start

```bash
npm init arcstack my-project
cd my-project
npm install
npm run dev
```

---

## Project Structure

```
src/
 ├── app/
 │   ├── http/
 │   │   ├── controllers/
 │   |   |── resources/
 │   └── services/
 │
 ├── core/
 │   ├── console/
 │   ├── middlewares/
 │   └── utils/
 │
 ├── routes/
 │   ├── api/
 │   └── web/
 │
 └── server.ts
```

### Structure Philosophy

- Controllers: HTTP layer
- Services: Business logic
- Resources: Response shaping
- Core: Framework-agnostic utilities

Switching frameworks should not require rewriting business logic.

---

## Supported Runtimes

| Framework | Status  |
| --------- | ------- |
| Express   | Stable  |
| H3        | Stable  |
| Fastify   | Planned |
| Bun       | Planned |

New adapters can be added without affecting the application layer.

---

Arcstack uses structured error classes and centralized error middleware.

Example:

```ts
throw new RequestError("Profile not found", 404);
```

All errors return consistent JSON:

```json
{
  "status": "error",
  "message": "Profile not found",
  "code": 404
}
```

---

## Resource Responses

Standardized API responses:

```ts
return new UserResource(req, res, user).json().status(200).additional({
  status: "success",
  message: "User retrieved",
});
```

Response format:

```json
{
  "data": {},
  "status": "success",
  "message": "User retrieved",
  "code": 200
}
```

---

## Development

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

---

## Design Goals

- Minimal magic
- Strong typing
- Clear separation of concerns
- Predictable structure
- Future-proof architecture

---

## Roadmap

- Fastify adapter
- Bun adapter
- CLI scaffolding generators
- Plugin system
- Authentication presets
- Validation layer abstraction
- Framework Switching

---

## Contributing

Contributions are welcome.

When adding framework adapters:

- Keep core framework-agnostic
- Avoid leaking framework types into business logic
- Follow established adapter patterns

---

## License

MIT

[i1]: https://img.shields.io/npm/v/create-arcstack?style=flat-square&label=create-arcstack&color=%230970ce
[l1]: https://www.npmjs.com/package/create-arcstack
[d1]: https://img.shields.io/npm/dt/create-arcstack?style=flat-square&label=Downloads&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcreate-arcstack
