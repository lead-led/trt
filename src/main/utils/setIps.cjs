const { networkInterfaces } = require('os');
const availableIps = () => {
	const nets = networkInterfaces();

	function parseObject(obj) {
		const result = [];

		Object.keys(obj).forEach((key) => {
			const addresses = obj[key];

			addresses.forEach((addressObj) => {
				const { address } = addressObj;

				const ipv4AddressRegex =
					/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

				if (ipv4AddressRegex.test(address)) {
					result.push({ nic: key, address });
				}
			});
		});

		return result;
	}

	return parseObject(nets);
};

module.exports = { availableIps };
