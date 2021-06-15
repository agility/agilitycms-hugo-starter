const agilityContentSync = require('@agility/content-sync')
const agilityFileSystem = require("@agility/content-sync/src/store-interface-filesystem");

const jsyaml = require("js-yaml")
const TurndownService = require('turndown')
const fs = require("fs")

require("dotenv").config()

const {  agilityConfig } = require('./agility.base')

const getSyncClient = ({ isPreview }) => {

	let cachePath = `node_modules/@agility/content-sync/cache/${isPreview ? "preview" : "live" }`;

	const apiKey = isPreview ? agilityConfig.previewAPIKey : agilityConfig.fetchAPIKey

	return agilityContentSync.getSyncClient({
		guid: agilityConfig.guid,
		apiKey: apiKey,
		isPreview: isPreview,
		languages: agilityConfig.languageCodes,
		channels: [agilityConfig.sitemap],
		store: {
			interface: agilityFileSystem,
			options: {
				rootPath: cachePath
			}
		}
	})
}

const runSync = async ({ isPreview }) => {

	//sync the agility content
	const agilitySyncClient = getSyncClient({ isPreview })
	await agilitySyncClient.runSync();

	//create the markdown files based on blog posts
	//await createMD({ agilityClient: agilitySyncClient.store, isPreview })

	if (agilityConfig.onBuild) {
		for (let i=0; i<agilityConfig.languageCodes.length; i++) {
			await agilityConfig.onBuild({
				languageCode:agilityConfig.languageCodes[i],
				agility: agilitySyncClient.store,
				channelName: agilityConfig.sitemap
			})
		}
	}

}

const clearSync = async ({ isPreview }) => {

	const agilitySyncClient = getSyncClient({ isPreview })
	await agilitySyncClient.clearSync();

	if (agilityConfig.onClean) {
		for (let i=0; i<agilityConfig.languageCodes.length; i++) {
			await agilityConfig.onClean({languageCode:agilityConfig.languageCodes[i]})
		}
	}

}

const createMD = async ({ agilityClient, isPreview }) => {

	//we are going to use the posts list to create blog posts in the content/post folder
	const folder = "content/post"
	const referenceName = "posts"
	const languageCode = agilityConfig.languageCode

	let posts = await agilityClient.getContentList({ referenceName, languageCode });
	let categories = await agilityClient.getContentList({ referenceName: 'categories', languageCode });
	let authors = await agilityClient.getContentList({ referenceName: 'authors', languageCode });

	const turndownService = new TurndownService()

	posts.forEach(async (post) => {

		const categoryID = post.fields.category.contentid;
		const authorID = post.fields.author.contentid;

		const category = categories.find(c => c.contentID == categoryID);
		const author = authors.find(a => a.contentID == authorID);


		let imageSrc = null
		if (post.fields.image) {
			//let's make the image field a little smaller...
			imageSrc = `${post.fields.image.url}?w=800`
		}


		let slug = post.fields.slug
		try {

			let filepath = `content/posts/${slug}.md`

			let frontMatter =
			{
				title: post.fields.title,
				date: post.fields.date,
				category: category ? category.fields.title : null,
				author: author ? author.fields.name : null,
				featured_image: imageSrc,
				draft: isPreview
			}

			const fmStr = jsyaml.safeDump(frontMatter)

			const mdBody = turndownService.turndown(post.fields.content)

			const md = `---\n${fmStr}\n---\r\n${mdBody}\r\n`

			fs.writeFileSync(filepath, md)


		} catch (e) {
			console.error(e)
		}

	})
}




if (process.argv[2]) {

	if (process.argv[2] === "clear") {
		//clear everything
		return clearSync({ isPreview: true });
		return clearSync({ isPreview: false });
	} else if (process.argv[2] === "sync") {
		//run the sync
		let isPreview = true
		if (process.argv[3] && process.argv[3] === "live") {
			isPreview = false
		}

		return runSync({ isPreview })

	}
}

module.exports = {
	clearSync,
	runSync
}