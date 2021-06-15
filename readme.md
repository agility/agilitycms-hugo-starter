# Agility CMS & Hugo Starter
This is sample Hugo starter site that uses Agility CMS and aims to be a foundation for building fully static sites using Hugo and Agility CMS.

[Live Website Demo](https://agility-hugo-starter.vercel.app)

[New to Agility CMS? Sign up for a FREE account](https://agilitycms.com/free)

## About This Starter

- Generates a combination of **Markdown** (.md) files in the content folder and **JSON** files in the data folder for each locale/language that you have configured.
- Connected to a sample Agility CMS Instance for sample content & pages.
- Supports full [Page Management](https://help.agilitycms.com/hc/en-us/articles/360055805831)
- Provides a functional structure that dynamically routes each page based on the request, loads a Page Template dynamically, and also dynamically loads and renders appropriate Agility CMS Page Modules as short codes (see the `layouts/shortcodes/page-modules` and `layouts/shortcodes/page-templates` folders).

### Tailwind CSS

This starter uses [Tailwind CSS](https://tailwindcss.com/), a simple and lightweight utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.

It also comes equipped with [Autoprefixer](https://www.npmjs.com/package/autoprefixer), a plugin which use the data based on current browser popularity and property support to apply CSS prefixes for you.

## Getting Started

To start using the Agility CMS & Hugo Starter, [sign up](https://agilitycms.com/free) for a FREE account and create a new Instance using the Next.js Blog Template.

1. Clone this repository
2. Run `npm install` or `yarn install`
3. Rename the `.env.example` file to `.env`
4. Retrieve your `GUID` and `API Keys (Preview/Fetch)` from Agility CMS by going to [Settings > API Keys](https://manager.agilitycms.com/settings/apikeys).

[How to Retrieve your GUID and API Keys from Agility](https://help.agilitycms.com/hc/en-us/articles/360031919212-Retrieving-your-API-Key-s-Guid-and-API-URL-)

## Running the Site Locally

### Development Mode

When running your site in `development` mode, you will see the latest content in real-time from the CMS.

#### yarn

1. `yarn install`
2. `yarn start`

To clear your content cache locally, run `yarn clean`

#### npm

1. `npm install`
2. `npm run start`

To clear your content cache locally, run `npm run cms-clean`


### Production Mode

When running your site in `production` mode, you will see the published from the CMS.

#### yarn

1. `yarn build`
2. `npx http-server public`

#### npm

1. `npm run build`
2. `npx http-server public`

## Notes

### How to Register Page Modules
To create a new Page Module, create a new shortcode file within the `/layouts/shortcodes/page-modules` directory.

### How to Register Page Modules
To create a new Page Templates, create a new shortcode file within the `/layouts/shortcodes/page-templates` directory.

## Resources

### Agility CMS
- [Official site](https://agilitycms.com)
- [Documentation](https://help.agilitycms.com/hc/en-us)

### Hugo
- [Official site](https://gohugo.io/)
- [Documentation](https://gohugo.io/documentation/)

### Tailwind CSS
- [Official site](http://tailwindcss.com/)
- [Documentation](http://tailwindcss.com/docs)

### Community
- [Official Slack](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)
- [Forums](https://help.agilitycms.com/hc/en-us/community/topics)
- [Facebook](https://www.facebook.com/AgilityCMS/)
- [Twitter](https://twitter.com/AgilityCMS)

## Feedback and Questions
If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agilitycms-hugo-starter/issues) on this repo, join our [Community Slack Channel](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI) or create a post on the [Agility Developer Community](https://help.agilitycms.com/hc/en-us/community/topics).
