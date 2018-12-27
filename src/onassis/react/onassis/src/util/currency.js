// c represents currency
function currencyFormat(c) {
	return parseFloat(Math.round(c* 100) / 100).toFixed(2)
}

export default currencyFormat