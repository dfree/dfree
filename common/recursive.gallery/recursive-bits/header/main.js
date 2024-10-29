const reText = () => {
  const rcTitle = document.querySelector(".rec-title");
  const rcText = document.querySelector(".rec-text");
  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  rcTitle.innerHTML = headline.title;
  rcText.innerHTML = headline.text;
}

window.addEventListener("load", reText);
window.addEventListener("click", reText);

const headlines = [
  { title: "Step Into Recursive Gallery", text: "An open space for web-coded immersive art that will captivate your soul." },
  { title: "Recursive Gallery Awaits You", text: "Unveil the beauty of interactive, coded art in an infinite space." },
  { title: "Immerse Yourself at Recursive Gallery", text: "Where every code tells a story, and every frame invites you to dive deeper." },
  { title: "Recursive Gallery:\n Art Redefined", text: "A sanctuary for those who seek elegance and interaction in coded artistry." },
  { title: "Recursive Gallery:\n Discover Infinity", text: "Art that draws you in, over and over again—just like recursion." },
  { title: "The Wonders of Recursive Gallery", text: "An inviting space for experiencing art that breathes through code." },
  { title: "Recursive Gallery Beckons", text: "Come explore a world where code and creativity converge." },
  { title: "Art Without Limits at Recursive Gallery", text: "Experience the elegance of art that responds and evolves." },
  { title: "Recursive Gallery:\n Where Code Becomes Art", text: "Enter the world of coded wonders, an immersive experience like no other." },
  { title: "Step Into Infinite Creativity at Recursive Gallery", text: "Where art is coded, recursive, and always enchanting." },
  { title: "Welcome to the Infinite: Recursive Gallery", text: "A place where art and code meet to take you on an unforgettable journey." },
  { title: "Recursive Gallery:\n Dive Into the Digital", text: "Explore the boundless possibilities of immersive coded art." },
  {
    title: "Recursive Gallery:\n Experience the Loop",
    text: "Art that loops, interacts, and enchants—step into a gallery unlike any other.",
  },
  {
    title: "Recursive Gallery:\n An Open Invitation",
    text: "Enter a space crafted for the creative at heart, welcoming all who cherish art.",
  },
  { title: "The Gallery That Never Ends", text: "Recursive Gallery is here to show you art like you’ve never seen before." },
  { title: "Recursive Gallery:\n A World to Get Lost In", text: "Immerse yourself in interactive coded masterpieces." },
  { title: "Recursive Gallery:\n Echoes of Art", text: "Where creativity reverberates in every corner of the web." },
  { title: "Feel the Recursion at Recursive Gallery", text: "Art that immerses, repeats, and evolves before your eyes." },
  {
    title: "Recursive Gallery:\n A Space for Immersive Exploration",
    text: "Art you can feel, code you can see, experiences you'll remember.",
  },
  { title: "Recursive Gallery:\n Art Beyond Boundaries", text: "An inviting open space for immersive and endlessly creative web art." },
  { title: "Recursive Gallery:\n Code Meets Canvas", text: "Step into the artful world of interactivity, beautifully coded and infinite." },
  { title: "Find Your Place in Recursive Gallery", text: "An open gallery where creativity knows no limits." },
  { title: "Recursive Gallery:\n Welcome to Infinity", text: "Where every line of code creates boundless beauty." },
  { title: "Immerse in Recursive Gallery", text: "Experience an endless journey through art coded for you." },
  { title: "Recursive Gallery:\n Explore, Engage, Enjoy", text: "A gallery that welcomes you to experience art on a deeper level." },
  { title: "Recursive Gallery:\n Art in the Loop", text: "Dive into interactive art experiences that echo and resonate." },
  { title: "Recursive Gallery:\n An Invitation to Wonder", text: "Step into a gallery where the only limit is imagination." },
  { title: "Recursive Gallery:\n An Endless Exploration", text: "Lose yourself in an open space of interactive art, beautifully coded." },
  { title: "Where Art Comes Alive: Recursive Gallery", text: "A welcoming space where coded art is brought to life." },
  { title: "Recursive Gallery:\n Art, Iterated", text: "Immerse yourself in the recursive beauty of coded masterpieces." },
  { title: "Enter Recursive Gallery", text: "A welcoming space of infinite interactive creativity." },
  { title: "Recursive Gallery:\n Dive into Digital Dreams", text: "Explore a gallery filled with endless imagination." },
  { title: "Recursive Gallery:\n The Artful Code", text: "Where creativity and coding converge to create art like no other." },
  { title: "Recursive Gallery:\n Endless Wonder Awaits", text: "Step into a world of immersive art that welcomes and astonishes." },
  { title: "The Recursive Journey Begins Here", text: "Explore the art of the infinite at Recursive Gallery." },
  { title: "Recursive Gallery:\n A Digital Wonderland", text: "Discover the world of interactive, immersive art designed for all." },
  { title: "Recursive Gallery:\n Beyond the Frame", text: "Where the art extends beyond traditional limits, crafted in code." },
  { title: "Recursive Gallery:\n Art, Reimagined", text: "Step into a welcoming space where art and interaction are intertwined." },
  { title: "Experience Recursive Gallery", text: "An elegant and endless gallery for those who love immersive art." },
  { title: "Recursive Gallery:\n Immerse Yourself", text: "A space crafted for creativity, filled with coded wonders." },
  { title: "Recursive Gallery:\n An Invitation to Infinity", text: "Step into a gallery that invites you to see art without end." },
  { title: "Recursive Gallery:\n Art Like No Other", text: "Where creativity is coded and every experience unique." },
  { title: "Recursive Gallery:\n A Place for Dreamers", text: "Open space for immersive, interactive art that calls you by name." },
  { title: "Recursive Gallery:\n Infinite Spaces", text: "Enter a gallery that grows and evolves, just as you do." },
  { title: "Welcome to Recursive Gallery", text: "A place where art is alive, coded, and waiting for you." },
  { title: "Recursive Gallery:\n A Journey into the Digital", text: "Step into a gallery where art and technology fuse elegantly." },
  { title: "Recursive Gallery:\n Explore the Infinite", text: "An open space where immersive coded art takes center stage." },
  { title: "The Beauty of Recursion at Recursive Gallery", text: "A welcoming space for endless creativity and immersive experiences." },
  { title: "Recursive Gallery:\n Art Without End", text: "Come and witness the immersive beauty that only Recursive Gallery offers." },
];
