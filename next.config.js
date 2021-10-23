module.exports = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/poll',
				permanent: true,
			},
		]
	},
}
