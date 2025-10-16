# Release Process

This repo keeps version bumps automatic so the default branch (`main`) always reflects the current state of development. Releases still happen manually whenever you choose.

## Choosing the bump size

1. Open a pull request as usual.
2. Decide the version impact:
   - If you do nothing, the merge will **automatically bump the patch** version.
   - To bump the minor version, leave a comment on the pull request body or discussion with the text `version minor`.
   - To bump the major version, comment `version major`.
   - You can also reset to a patch bump by commenting `version patch`.
3. The comment command reacts with 🚀 and attaches the corresponding `release:*` label to the PR. Only organization members/collaborators can trigger the command.
4. When the PR merges into `main`, the **Bump Version On Merge** workflow runs, executes the scripted bump (`version/patch.js`, `version/minor.js`, or `version/major.js`), and commits the updated `package.json` straight to `main`.

## Cutting a release

Once you are ready to ship the current version from `main`, pick one of the manual paths:

1. **GitHub workflow** – From the Actions tab, dispatch the `Release` workflow. It builds the macOS and Windows artifacts with `electron-builder` and publishes them as a GitHub release using the version already on `main`.
2. **Local script** – Pull `main`, ensure the working tree is clean, then run `npm run release` (or `npm run release:{patch|minor|major}` if you prefer the scripted helpers). This funnels through `electron-builder` and uses your local credentials/tokens to publish.

Because the version bump already landed on `main`, neither option requires additional version tweaking right before release.
