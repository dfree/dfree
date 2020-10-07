(function () {
	window.onload = function(e) {
		var DEMO = true;
		var start = document.getElementById('start');
		var end = document.getElementById('end');
		var button = document.getElementById('butt');
		var printer = document.getElementById('printer');
		var scaleContainer = document.createElement('div');
		var format = "YYYY MM DD HH:mm:ss";
		var startDate = '2020 10 01 00:00:00';

		const artifact = 'firstDateWasLater';
		const space = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';

		const dictHuAll = {
			years: 'év',
			months: 'hónap',
			days: 'nap',
			hours: 'óra',
			minutes: 'perc',
			seconds: 'másodperc',
		}

		const dictHu = {
			years: 'év',
			months: 'hónap',
			days: 'nap',
			hours: 'óra',
			minutes: 'perc',
		}

		const dictHuSec = {
			seconds: 'másodperc',
		}

		const milestoneIntervals = [
			{
				name: '1 perc',
				value: { minutes: 1 },
			},
			{
				name: '1 óra',
				value: { hours: 1 },
			},
			{
				name: '2 óra',
				value: { hours: 2 },
			},
			{
				name: '1 nap',
				value: { days: 1 },
			},
			{
				name: '1 hét',
				value: { days: 7 },
			},
			{
				name: '1 hónap',
				value: { months:1 },
			},
			{
				name: '3 hónap',
				value: {months:3},
			},
			{
				name: '1 év',
				value: {years: 1},
			},
			{
				name: '5 év',
				value: {years: 5},
			}
		];
		
		function init() {
			console.log(moment.utc(moment(startDate, format)).unix());
			console.log(moment().format(format));
			start.value = moment(startDate, format).format(format);
			//start.value = moment().format(format);
			end.value = moment().format(format);
			button.addEventListener('click', print);
			print();
			document.addEventListener('keyup', function(e){
				if(e.key === 'Enter'){
					print();
				}
			});
		}
		const getDiff = (dict, duration) => Object.keys(dict).reduce((acc, curr) => duration[curr] ? acc + ` ${duration[curr]} ${dict[curr]}` : acc, '').substring(1);

		const prepMilestones = (startMoment, milestoneIntervals) => milestoneIntervals.map(mile => ({
			...mile,
			unix: moment.utc(startMoment.clone()).add(mile.value).unix(),
		}));

		function print() {
			console.log(start.value);
			let text = '';

			const startMoment = moment.utc(moment(start.value, format));
			const nowMoment = moment.utc(moment(end.value, format));

			// osszes ido
			text += 'Összesen eltelt idő:\n'

			// npm install moment-precise-range-plugin
			const durationEn = moment.preciseDiff(startMoment, nowMoment, true)
			const duration = getDiff(dictHuAll, durationEn);
			console.log(durationEn);
			//const durationString = duration.reduce();
			text += space + '<b>'+duration+'</b>';

			// kiírt ido:

			text += '\n\nKiírt idő (ha kisebb mint 1 perc akkor másodperc mutatása):\n'
			const diff = moment(nowMoment).diff(startMoment) / 1000;
			console.log(diff)
			const dict = diff < 60 ? dictHuSec : dictHu;
			const printedDuration = getDiff(dict, durationEn);
			text += space + '<b>'+printedDuration+'</b>';

			// milestones !!!

			const milestones = prepMilestones(startMoment, milestoneIntervals);

			text += '\n\n<b>Célok:</b>';

			milestones.forEach(mile => {
				const targetString = moment.utc(mile.unix * 1000).local().format(format);
				let targetArr = targetString.split(' ');
				const dateText = `<span class="red">${targetArr[targetArr.length - 2]} ${targetArr[targetArr.length - 1]}</span>`;
				targetArr.pop();
				targetArr.pop();
				text += `\n\n${mile.name}:\n${space}${targetArr.join(' ')} <span class="red">${dateText}</span>\n`;

				
				

				//console.log(nowMoment.unix(), mile.unix);
				if(mile.unix < nowMoment.unix()){
					text += space + 'Teljesítve';
					return;
				}
				const test = getDiff(dictHuAll, moment.preciseDiff(moment(mile.unix * 1000), nowMoment.unix() * 1000, true));
				//const test = getDiff(dictHuAll, moment.duration(moment(mile.unix * 1000).diff(nowMoment, true)));
				//const test = getDiff(dictHuAll, getDiff(dictHuAll, nowMoment.diff(moment(mile.unix * 1000), true)));
				console.log(test)
				//const remainingUnix = mile.unix - nowMoment.unix();

				//const test = (mile.unix - nowMoment.unix()) * 1000;
				//console.log(moment(mile.unix * 1000).unix() * 1000, nowMoment.unix() * 1000)
				//const remainingTime = getDiff(dictHuAll, nowMoment.diff(moment(mile.unix * 1000), true));
				text += space + 'Eltelt idő:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b>'+duration+'</b>\n';
				text += space + 'Fennmaradó:&nbsp&nbsp&nbsp<b>'+test+'</b>';
			});
			console.log(milestones)
			printer.innerHTML = text;

		}
		init();
	};
})();