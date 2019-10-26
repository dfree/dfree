
var title = "ROTEC Data Visualisation Application Development Timeline";
var footer = '<a href="https://dfree.co.uk" target:"_blank">dfree.co.uk</a>';
var setup = [
	{name:"Phase 0", finish:"PREPARANCE", time:"~ 3 weeks", months:0.7, lines:[
		{start:0, end:30, color:3, name:"Brainstorming about the brief"},
		{start:0, end:30, color:5, name:"Cleaning down requirements and responsibilities"},
		{start:50, end:85, color:7, name:"Detailed specification"},
		{start:10, end:50, color:9, name:"UI sketches"},
		{start:0, end:85, color:11, name:"Decisions about the main communication schemes and used technologies"},
		{start:75, end:100, color:13, name:"Specification signing"},
		{start:75, end:100, color:15, name:"Contract signing"},
	]},
	{name:"Phase 1", finish:"PROTOTYPE", time:"~ 2.5 - 3 months", months:2.5, lines:[
		{start:0, end:100, color:10, thick:true, name:"Development of a fully functioning prototype application"},
		{start:0, end:70, color:14, thick:true, name:"Foundations of the server side communication"},
	]},
	{name:"Phase 2", finish:"DESIGN", time:"~ 2 months", months:2, lines:[
		{start:0, end:100, color:0, thick:true, name:"Draw conclusions of the Prototype, finalise the requirements, content of screens and overall usage flow of the application."},
		{start:30, end:100, color:2, name:"Finalise user stories and user experience (hot keys, gestures, buttons)"},
		{start:50, end:100, color:4, name:"Creation of a consistent UI design, color themes and graphic design."},
	]},
	{name:"Phase 3", finish:"CONSTANT<br/>UPDATES", time:"agile development", months:5, lines:[
		{start:0, end:14, arrow:true, color:6, name:"Applying the final design to the prototype or start to build an enterprise solution"},
		{start:14, end:28, arrow:true, color:8, name:"Save or send the whole report as html email (on alarm events too)"},
		{start:28, end:42, arrow:true, color:10, name:"Advanced user handling and notifications"},
		{start:42, end:56, arrow:true, color:15, name:"Interactive graph grids and layers."},
		{start:56, end:70, arrow:true, color:14, name:"File management"},
		{start:70, end:84, arrow:true, color:0, name:"Logging"},
		{start:84, end:100, arrow:true, color:2, name:"And more..."},
		
	]}
];
		