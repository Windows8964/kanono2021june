window.beta = true;
window.servers = window.beta ? [{
  wsLink: (window.top.location.protocol == "https:" ? "wss://" : "ws://") + window.top.location.host + "/server",
  name: "Localhost"
}] : [{
  wsLink: "wss://kanonoserver.glitch.me",
  name: "Glitch"
}, {
  wsLink: "ws://188.166.46.175:8080/",
  name: "VPS"
}, {
  wsLink: "ws://localhost:8080",
  name: "Localhost"
}];
// Year, Month, Full Date
window.changelogDate = [1642606410699];
window.changelog = ["Add your own changelog!"];
//window.changelog = ["Added 4TDM", "Machine Gun reload is now slower", "Penetration now does stuff", "Added autofire", "You can now upgrade your stats/skills with numbers in your key", "Fixed a bug, where all of the bullet healths were the same, causing bullets to be extremely weak", "Fixed Triple Shot, Destroyer and Annihilator design (Suggested by Oblivion)", "Nerfed Assassin, Sniper and Ranger spray", "Buffed movement speed skill", "Added Negev", "Fixed a circle rendering issue", "Adjusted the UI a lot", "Adjusted the UI size to be better for every screen", "Fixed a bug where the tanks didnt grow on death animation", "Pressing enter on death screen now redirects you to the menu", "Changed connecting screen background to be a grid", "Finally implemented reload delay, no more cursed tanks", "Added giant polygons like alpha pentagon, but more valueable and bigger"];
window.inComingChangelog = ["Added 4TDM", "Machine Gun reload is now slower", "Penetration now does stuff", "Added autofire", "You can now upgrade your stats/skills with numbers in your key", "Fixed a bug, where all of the bullet healths were the same, causing bullets to be extremely weak", "Fixed Destroyer and Annihilator design (Suggested by Oblivion)", "Nerfed Assassin, Sniper and Ranger spray", "Buffed movement speed skill", "Added Negev", "Fixed a circle rendering issue", "Adjusted the UI a lot", "Adjusted the UI size to be better for every screen", "Fixed a bug where the tanks didnt grow on death animation", "Pressing enter on death screen now redirects you to the menu", "Changed connecting screen background to be a grid", "Finally implemented reload delay, no more cursed tanks"];
window.previousChangelogs = [["Rightclicking now doesnt open the menu"]];