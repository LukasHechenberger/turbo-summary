# turbo-summary

Visualize a [Turborepo](https://turborepo.com) summary file created with [`turbo run [...task] --summarize`](https://turborepo.com/docs/crafting-your-repository/caching#using-run-summaries)

> [!NOTE]
> This project is in a pretty early stage. It works fine so far, but many [features I want to implement](#planned-features) are still missing. [Create an Issue](https://github.com/LukasHechenberger/turbo-summary/issues/new) if you have any thoughts 😉.

## Usage

Head over to [turbo-summary-web.vercel.app](https://turbo-summary-web.vercel.app) and upload your summary file.

## Planned features

- Diff between two runs (similar to [what vercel does](https://vercel.com/changelog/turborepo-run-summary-is-now-available))
- Export as an image
- REST API
- GitHub action integration
- VSCode extension
