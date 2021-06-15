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