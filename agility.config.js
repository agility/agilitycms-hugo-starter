const fs = require('fs')
const path = require('path')
const os = require('os')

const jsyaml = require("js-yaml")
const TurndownService = require('turndown')

module.exports = {
	loader: {
		"global": async ({ agility, languageCode, channelName }) => {

			//save the header and footer...
			let header = await agility.getContentList({ referenceName: "siteheader", languageCode });
			if (header.length > 0) header = header[0]

			let nestedSitemap = await agility.getSitemapNested({
				channelName,
				languageCode,
			  });

			  if (!nestedSitemap) return {};

			let navigation = nestedSitemap.filter((n) => n.visible.menu);

			return {
				header,
				navigation
			}
		},
		"posts": async ({ agility, languageCode, channelName }) => {

			const referenceName = "posts"
			let posts = await agility.getContentList({ referenceName, languageCode, depth: 1, take: 50 });



			return posts.items.map(p => {
				return {

					date: p.fields.date,

					// title
					title: p.fields.title,

					// slug
					slug: p.fields.slug,

					// image
					image: p.fields.image
				}
			})
			//let categories = await agility.getContentList({ referenceName: 'categories', languageCode });
			//let authors = await agility.getContentList({ referenceName: 'authors', languageCode });

			/*
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

						let pageContentFile = `content/posts/${slug}.md`

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

						fs.writeFileSync(pageContentFile, md)


					} catch (e) {
						console.error(e)
					}
				})
				*/

		}
	}
}

