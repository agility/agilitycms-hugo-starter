const fs = require('fs')
const path = require('path')
const os = require('os')

const jsyaml = require("js-yaml")
const TurndownService = require('turndown')

require("dotenv").config()

const customConfig = require("../agility.config.js")

const languageCodes = process.env.AGILITY_LOCALES.split(",")

const defaultConfig =  {
	guid: process.env.AGILITY_GUID, //Set your guid here
	fetchAPIKey: process.env.AGILITY_API_FETCH_KEY, //Set your fetch apikey here
	previewAPIKey: process.env.AGILITY_API_PREVIEW_KEY, //set your preview apikey
	languageCodes, //the languages for your website in Agility CMS
	sitemap: process.env.AGILITY_SITEMAP, //the name of your channel/sitemap in Agility CMS
	onClean: async ({ languageCode }) => {
		//delete any content that needs to be cleaned up
		const contentPath = path.join("content", languageCode);
		const dataPath = path.join("data", languageCode);


		if (fs.existsSync(contentPath)) {
			console.log("Cleaning content folder:", contentPath)
			fs.rmdirSync(contentPath, { recursive: true })
		}

		if (fs.existsSync(dataPath)) {
			console.log("Cleaning data folder:", dataPath)
			fs.rmdirSync(dataPath, { recursive: true })
		}

	},
	onBuild: async ({ agility, languageCode, channelName }) => {
		//output the pages
		const contentPath = path.join("content", languageCode);
		const dataPath = path.join("data", languageCode);

		//clear out the content on build
		if (fs.existsSync(contentPath)) {
			fs.rmdirSync(contentPath, { recursive: true })
		}
		if (fs.existsSync(dataPath)) {
			fs.rmdirSync(dataPath, { recursive: true })
		}

		fs.mkdirSync(contentPath, { recursive: true })
		fs.mkdirSync(dataPath, { recursive: true })

		//LOOP ALL THE PAGES AND OUTPUT THEM TO THEIR FOLDERS...
		const sitemapFlat = await agility.getSitemapFlat({ languageCode, channelName })

		let pageIndex = 0
		for (let sitemapPath in sitemapFlat) {
			const sitemapObj = sitemapFlat[sitemapPath]
			const pageObj = await agility.getPage({ languageCode, channelName, pageID: sitemapObj.pageID })

			if (! pageObj) {
				continue
			}

			let dynamicPageItem = null
			if (sitemapObj.contentID > 0) {
				dynamicPageItem = await agility.getContentItem({ languageCode, contentID: sitemapObj.contentID, depth: 2 })
				if (dynamicPageItem) {
					const dynamicContentItemDataFile = path.join(dataPath, `content-${sitemapObj.contentID}.json`)
					const dynamicContentItemJSON = JSON.stringify(dynamicPageItem)
					fs.writeFileSync(dynamicContentItemDataFile, dynamicContentItemJSON)
				}
			}

			const pagePath = pageIndex == 0 ? "" : sitemapObj.path
			const pageContentPath = path.join(contentPath, pagePath)

			if (! fs.existsSync(pageContentPath)) {
				fs.mkdirSync(pageContentPath)
			}
			const pageContentFile = path.join(pageContentPath, "_index.md")
			const pageDataFile = path.join(dataPath, `page-${sitemapObj.pageID}.json`)

			const pageTemplate = pageObj.templateName.replace(" ", "-").toLowerCase()

			//create the md object
			let frontMatter =
			{
				title: pageObj.title,
				description: pageObj.seo.metaDescription
			}

			const fmStr = jsyaml.dump(frontMatter)
			let mdBody  = `{{< page-templates/${pageTemplate} pageFile="page-${ sitemapObj.pageID }" >}}`

			for (const zoneName in pageObj.zones) {
				const zone = pageObj.zones[zoneName]
				const loweredZoneName = zoneName.toLowerCase()
				mdBody  += `{{< page-templates/${loweredZoneName} pageFile="page-${ sitemapObj.pageID }" >}}`

				for (let moduleIndex = 0; moduleIndex<zone.length; moduleIndex++) {

					const moduleObj = zone[moduleIndex]

					const moduleDataFile = path.join(dataPath, `module-${moduleObj.item.contentID}.json`)
					const moduleJSON = JSON.stringify( moduleObj.item )
					fs.writeFileSync(moduleDataFile, moduleJSON)

					 const moduleName = moduleObj.module.toLowerCase()
					 if (dynamicPageItem) {
						mdBody += `\n  {{< page-modules/${moduleName} pageFile="page-${ sitemapObj.pageID }" moduleFile="module-${moduleObj.item.contentID}" dynamicContentItem="content-${dynamicPageItem.contentID}" >}}`
					 } else {
						mdBody += `\n  {{< page-modules/${moduleName} pageFile="page-${ sitemapObj.pageID }" moduleFile="module-${moduleObj.item.contentID}" >}}`
					 }


				}

				mdBody += `\n{{< /page-templates/${loweredZoneName} >}}`
			}


			mdBody += `{{< /page-templates/${pageTemplate} >}}`


			const md = `---\n${fmStr}\n---\r\n${mdBody}\r\n`

			fs.writeFileSync(pageContentFile, md)

			//write out a json file for the page...
			const pageJSON = JSON.stringify( pageObj )
			fs.writeFileSync(pageDataFile, pageJSON)

			++pageIndex
		}

		//loop the loaders and load their data
		for (const dataName in agilityConfig.loader) {
			try {
				console.log("Loading data: ", dataName)

				const dataLoader = agilityConfig.loader[dataName]

				const loaderDataFile = path.join(dataPath, `${dataName}.json`)
				const data = await dataLoader({agility, languageCode, channelName})

				const dataJSON = JSON.stringify(data)

				fs.writeFileSync(loaderDataFile, dataJSON)

			} catch (error) {
				throw new Error(`Could not render loader ${dataName}: ${error}`)
			}
		}

	},
	loader: {
		"dataname": async () => {
		}
	}
}

const agilityConfig = {
	...defaultConfig,
	...customConfig
	//mutations: customConfig ? customConfig.mutations : defaultConfig.mutations
}


module.exports = {
	agilityConfig
}
