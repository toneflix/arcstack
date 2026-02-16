<p align="center"><a href="https://h3ravel.toneflix.net" target="_blank"><img src="https://raw.githubusercontent.com/h3ravel/assets/refs/heads/main/logo-full.svg" width="400" alt="H3ravel Logo"></a></p>

[![Framework][ix]][lx]
[![Create H3ravel][i1]][l1]
[![Downloads][d1]][d1]

# About Create H3ravel

Scaffold a new [H3ravel](https://h3ravel.toneflix.net) applications using kits and starter kits.

## Starter kits

You can use between one of the following official starter kits, or bring your own using the `--kit` flag.

- `full` : A full H3ravel application with everything possible.
- `lean` : A lean H3ravel application with just the framework core.
- `api` : Creates a H3ravel application for building JSON APIs.
- `web`: Creates a H3ravel application for building a server rendered app.
- `inertia`: Inertia application with a frontend framework of your choice.

## Usage

```sh
# Using npm
npm init h3ravel

# Using yarn
yarn create h3ravel

# Using pnpm
pnpm create h3ravel
```

## Options

### `location`

You can pass the installation `location` directory as the first argument to the command. For example:

```sh
npm init h3ravel my-app
```

or even

```sh
npm init h3ravel ./
```

This argument is optional and the command will prompt you to enter the installation `location` if not provided.

> **Note** - The location must be empty or the command will fail.

### `--kit` | `-k` (Default: Prompts for selection)

You can also use your own starter kit hosted on Github, Gitlab, or Bitbucket, use the `--kit` flag to define the repo URL.

```sh
# Download from GitHub
npm init h3ravel -- --kit="github:github_user/repo"

# Github is the default provider, so if not specified, it will be assumed as github
npm init h3ravel -- --kit="github_user/repo"

# Download from GitLab
npm init h3ravel -- --kit="gitlab:user/repo"

# Download from BitBucket
npm init h3ravel -- --kit="bitbucket:user/repo"
```

You can also pass the branch or tag name as follows:

```sh
# Branch name
npm init h3ravel -- --kit="github:github_user/repo#branch-name"

# Tag name
npm init h3ravel -- --kit="github:github_user/repo#v1.0.0"
```

### `--token` | `-t`

If you are using a custom starter kit hosted on a private repository, then you can pass the authentication token with the `--token` options:

```sh
npm init h3ravel -- --kit="github:github_user/repo" --token="github_token"
```

## Contributing

Thank you for considering contributing to the H3ravel framework! The [Contribution Guide](https://h3ravel.toneflix.net/contributing) can be found in the H3ravel documentation and will provide you with all the information you need to get started.

## Code of Conduct

In order to ensure that the H3ravel community is welcoming to all, please review and abide by the [Code of Conduct](#).

## Security Vulnerabilities

If you discover a security vulnerability within H3ravel, please send an e-mail to Legacy via hamzas.legacy@toneflix.ng. All security vulnerabilities will be promptly addressed.

## License

The H3ravel framework and all it's base packages are open-sourced software licensed under the [MIT license](LICENSE).

[ix]: https://img.shields.io/npm/v/%40h3ravel%2Fcore?style=flat-square&label=Framework&color=%230970ce
[lx]: https://www.npmjs.com/package/@h3ravel/core
[i1]: https://img.shields.io/npm/v/create-h3ravel?style=flat-square&label=create-h3ravel&color=%230970ce
[l1]: https://www.npmjs.com/package/create-h3ravel
[d1]: https://img.shields.io/npm/dt/create-h3ravel?style=flat-square&label=Downloads&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcreate-h3ravel
