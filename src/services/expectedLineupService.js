const rp = require('request-promise');
const url = 'https://www.rotowire.com/soccer/lineups.php';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

export function playerWillStart(name, team) {
	const teamBase = team.split(' ')[0];

	rp(proxyUrl + url)
		.then(function(html) {
			if (html.includes(`${teamBase}`)) {
				if (html.includes(`${name}`)) {
					const answer = 'Yes';
					console.log('team and name found');
					return 'Yes';
				} else {
					console.log('team found but not player');
					return 'No';
				}
			} else {
				console.log('team not found');
				return 'N/A';
			}
		})
		.catch(function(err) {
			console.log(err);
		});
}
