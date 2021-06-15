
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

		}
	}
}

