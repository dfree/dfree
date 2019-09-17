
var title = "ROTEC Data Visualisation Application Development Timeline";
var footer = '<a href="https://dfree.co.uk" target:"_blank">dfree.co.uk</a>';
var setup = [
	{name:"Milestone 1", finish:"PREPARANCE", time:"~ 3 weeks", months:0.7, lines:[
		{start:0, end:30, color:3, name:"Brainstorming about the brief"},
		{start:0, end:30, color:5, name:"Cleaning down requirements and responsibilities"},
		{start:0, end:85, color:7, name:"Detailed specification"},
		{start:30, end:85, color:9, name:"UI sketches"},
		{start:10, end:85, color:11, name:"Decisions about the main communication schemes and used technologies"},
		{start:75, end:100, color:13, name:"Specification signing"},
		{start:75, end:100, color:15, name:"Contract signing"},
	]},
	{name:"Milestone 2", finish:"PROTOTYPE", time:"~ 1.5 months", months:1.5, lines:[
		{start:0, end:70, color:14, name:"Creation of User Interface foundations (mobile and desktop) in Photoshop"},
		{start:0, end:100, color:10, name:"Prototype application for one station (focused on server side communication)"},
		{start:70, end:100, color:8, name:"Design of different data visualisation (mobile and desktop)"},
		{start:0, end:100, color:6, name:"User story, site map finalisation"}
	]},
	{name:"Milestone 3", finish:"BETA", time:"~ 3-4 months", months:3, lines:[
		{start:0, end:100, color:0, thick:true, name:"Development of a beta application with final design and server side communication involving a close set of station, alongside continous product owner controll (with regular online meetings)"},
		{start:30, end:50, color:2, name:"User friendly solution for add and remove stations"},
		{start:50, end:100, color:4, name:"Development of the data visualisation core."},
		{start:80, end:100, color:6, name:"Handling user levels and access rights"},
		/*{start:50, end:60, color:8, name:"Open ID integráció"},
		{start:50, end:90, color:10, name:"QR code generálás es validáció"},*/
		
	]},
	{name:"Milestone 4", finish:"PUBLIC<br/>RELEASE", time:"~ 2 months", months:2, lines:[
		{start:0, end:30, arrow:true, color:6, name:"Extending the application for all stations"},
		{start:20, end:80, arrow:true, color:8, name:"Final touches of data visualisation"},
		{start:50, end:60, arrow:true, color:10, name:"Preassure and Error handling tests"},
		{start:60, end:95, arrow:true, color:15, name:"Live user UX testing"},
		{start:70, end:98, arrow:true, color:14, name:"More and more testing"},
		{start:60, end:95, arrow:true, color:0, name:"Mobile and Crossbrowser optimisation (for new browsers)"},
		{start:92, end:100, arrow:true, color:2, name:"Release of the product"},
		
	]}
];
		