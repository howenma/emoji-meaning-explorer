{\rtf1\ansi\ansicpg950\cocoartf2709
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;\f1\fnil\fcharset0 HelveticaNeue-Bold;\f2\fnil\fcharset0 HelveticaNeue;
\f3\fnil\fcharset0 .AppleColorEmojiUI;\f4\fnil\fcharset136 PingFangTC-Regular;\f5\fnil\fcharset0 Menlo-Regular;
}
{\colortbl;\red255\green255\blue255;\red193\green193\blue193;}
{\*\expandedcolortbl;;\cssrgb\c80000\c80000\c80000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 \uc0\u31532 \u19968 \u29256 :\
\
\pard\pardeftab560\sa40\partightenfactor0

\f1\b\fs32 \cf0 Emoji\uc0\u8232 \u8232 Index:\
\pard\pardeftab560\slleading20\partightenfactor0

\f2\b0\fs26 \cf0 \uc0\u8232 <!DOCTYPE html>\
<html lang="en">\
<head>\
  <meta charset="UTF-8" />\
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\
  <title>Emoji Meaning Explorer</title>\
  <link rel="stylesheet" href="style.css" />\
</head>\
<body>\
  <div class="site-header">\
    <h1>Emoji Meaning Explorer</h1>\
    <p class="site-subtitle">Find, share, and vote on emoji meanings \'96 together.</p>\
  </div>\
\
  <div class="container">\
    <nav class="sidebar" id="categoryMenu"></nav>\
\
    <div class="content">\
      <input type="text" id="emoji-search" placeholder="Search emoji or meaning..." />\
      <main id="emojiContainer"></main>\
    </div>\
\
    <aside class="meaning-panel" id="emoji-details" style="display: none;">\
      <h2 id="emoji-title"></h2>\
\
      <ul id="interpretations-list">\
        <!-- Interpretations will be injected here -->\
      </ul>\
\
      <button id="show-all-button" style="display: none;">Show all</button>\
\
      <div class="submit-section">\
        <input id="user-input" placeholder="Add your interpretation..." />\
        <button id="submit-meaning">Submit</button>\
      </div>\
    </aside>\
  </div>\
\
  <div class="copy-toast" id="copy-toast">Emoji copied!</div>\
\
  <script src="emojiData.js"></script>\
  <script src="script.js"></script>\
</body>\
</html>\
\
Script:\uc0\u8232 const emojiContainer = document.getElementById("emojiContainer");\
const categoryMenu = document.getElementById("categoryMenu");\
const emojiDetails = document.getElementById("emoji-details");\
const emojiTitle = document.getElementById("emoji-title");\
const interpretationsList = document.getElementById("interpretations-list");\
const userInput = document.getElementById("user-input");\
const submitButton = document.getElementById("submit-meaning");\
const showAllButton = document.getElementById("show-all-button");\
const emojiSearch = document.getElementById("emoji-search");\
\
let currentEmoji = null;\
let allInterpretations = \{\};\
\
function getVoteStorage() \{\
  return JSON.parse(localStorage.getItem("emojiVotes") || "\{\}");\
\}\
\
function saveVoteStorage(storage) \{\
  localStorage.setItem("emojiVotes", JSON.stringify(storage));\
\}\
\
function renderEmojiCategories() \{\
  for (const category in window.emojiCategories) \{\
    const section = document.createElement("section");\
    section.classList.add("emoji-category");\
    section.id = category.replace(/\\s+/g, "-");\
\
    const title = document.createElement("h2");\
    title.textContent = category;\
    section.appendChild(title);\
\
    const buttonWrapper = document.createElement("div");\
    buttonWrapper.className = "emoji-buttons";\
\
    window.emojiCategories[category].forEach((\{ emoji, name, meaning \}) => \{\
      const button = document.createElement("button");\
      button.textContent = emoji;\
      button.title = name;\
      button.onclick = () => showEmojiDetails(emoji, name, meaning);\
      buttonWrapper.appendChild(button);\
    \});\
\
    section.appendChild(buttonWrapper);\
    emojiContainer.appendChild(section);\
\
    const menuItem = document.createElement("a");\
    menuItem.href = "#" + section.id;\
    menuItem.textContent = category;\
    categoryMenu.appendChild(menuItem);\
  \}\
\}\
\
function showEmojiDetails(emoji, name, meaning) \{\
  currentEmoji = emoji;\
  emojiTitle.innerHTML = `$\{emoji\} <strong>$\{name\}</strong>`;\
\
  if (!allInterpretations[emoji]) \{\
    allInterpretations[emoji] = [\
      \{ text: meaning, likes: 0, isOfficial: true \}\
    ];\
  \}\
\
  renderInterpretations(emoji);\
  emojiDetails.style.display = "block";\
\}\
\
function renderInterpretations(emoji) \{\
  interpretationsList.innerHTML = "";\
\
  const interpretations = [...(allInterpretations[emoji] || [])];\
  const voteData = getVoteStorage();\
\
  const voteSet = new Set(voteData[emoji] || []);\
\
  interpretations.forEach((interp, index) => \{\
    const li = document.createElement("li");\
\
    const text = document.createElement("span");\
    text.textContent = `$\{index + 1\}. $\{interp.text\}`;\
\
    const like = document.createElement("button");\
    like.textContent = "\uc0\u55357 \u56397  " + interp.likes;\
    like.className = "interp-like";\
\
    if (voteSet.has(index)) \{\
      like.classList.add("liked");\
    \}\
\
    like.onclick = () => \{\
      const storage = getVoteStorage();\
      const userVotes = new Set(storage[emoji] || []);\
      if (userVotes.has(index)) \{\
        interp.likes--;\
        userVotes.delete(index);\
      \} else \{\
        interp.likes++;\
        userVotes.add(index);\
      \}\
      storage[emoji] = Array.from(userVotes);\
      saveVoteStorage(storage);\
      renderInterpretations(emoji);\
    \};\
\
    li.appendChild(text);\
    li.appendChild(like);\
    interpretationsList.appendChild(li);\
  \});\
\
  showAllButton.style.display = interpretations.length > 3 ? "block" : "none";\
\}\
\
submitButton.onclick = () => \{\
  const value = userInput.value.trim();\
  if (!value || !currentEmoji) return;\
\
  if (!allInterpretations[currentEmoji]) \{\
    allInterpretations[currentEmoji] = [];\
  \}\
  allInterpretations[currentEmoji].push(\{ text: value, likes: 0 \});\
  userInput.value = "";\
  renderInterpretations(currentEmoji);\
\};\
\
emojiSearch.addEventListener("input", function () \{\
  const search = this.value.toLowerCase();\
  const buttons = document.querySelectorAll(".emoji-buttons button");\
  buttons.forEach((btn) => \{\
    const name = btn.title.toLowerCase();\
    const emoji = btn.textContent;\
    btn.style.display =\
      name.includes(search) || emoji.includes(search) ? "inline-block" : "none";\
  \});\
\});\
\
renderEmojiCategories();\
\
\pard\pardeftab560\partightenfactor0

\f1\b\fs40 \cf0 Style:\uc0\u8232 \u8232 body \{\
\pard\pardeftab560\slleading20\partightenfactor0

\f2\b0\fs26 \cf0   font-family: Arial, sans-serif;\
  margin: 0;\
  background-color: #f9f9f9;\
  color: #333;\
\}\
\
.site-header \{\
  background: #ffffff;\
  padding: 1.5rem 2rem 1rem;\
  border-bottom: 1px solid #ddd;\
  text-align: center;\
\}\
\
.site-header h1 \{\
  margin: 0;\
  font-size: 2rem;\
\}\
\
.site-subtitle \{\
  color: #777;\
  font-size: 1rem;\
  margin-top: 0.5rem;\
\}\
\
.container \{\
  display: flex;\
  height: calc(100vh - 120px);\
  overflow: hidden;\
\}\
\
.sidebar \{\
  width: 200px;\
  background-color: #fff;\
  border-right: 1px solid #ddd;\
  padding: 1rem;\
  overflow-y: auto;\
\}\
\
.sidebar a \{\
  display: block;\
  margin-bottom: 1rem;\
  color: #007BFF;\
  text-decoration: none;\
  font-weight: bold;\
\}\
\
.sidebar a:hover \{\
  text-decoration: underline;\
\}\
\
.content \{\
  flex: 1;\
  padding: 1.5rem;\
  overflow-y: auto;\
\}\
\
#emoji-search \{\
  width: 100%;\
  padding: 10px;\
  margin-bottom: 1.5rem;\
  font-size: 16px;\
  border: 1px solid #ccc;\
  border-radius: 6px;\
\}\
\
.emoji-category \{\
  margin-bottom: 2rem;\
\}\
\
.emoji-category h2 \{\
  margin-bottom: 0.5rem;\
  font-size: 1.25rem;\
\}\
\
.emoji-buttons \{\
  display: flex;\
  flex-wrap: wrap;\
  gap: 10px;\
\}\
\
.emoji-buttons button \{\
  font-size: 28px;\
  padding: 10px;\
  cursor: pointer;\
  background: #fff;\
  border: 1px solid #ccc;\
  border-radius: 8px;\
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);\
  transition: transform 0.1s ease;\
\}\
\
.emoji-buttons button:hover \{\
  transform: scale(1.2);\
\}\
\
.meaning-panel \{\
  width: 320px;\
  background-color: #ffffff;\
  border-left: 1px solid #ddd;\
  padding: 1rem;\
  overflow-y: auto;\
\}\
\
.meaning-panel h2 \{\
  margin-top: 0;\
\}\
\
#emoji-description \{\
  font-size: 16px;\
  margin-bottom: 10px;\
\}\
\
#user-input \{\
  width: 100%;\
  padding: 10px;\
  font-size: 16px;\
  margin: 10px 0;\
  border-radius: 6px;\
  border: 1px solid #ccc;\
\}\
\
#submit-meaning \{\
  padding: 8px 16px;\
  font-size: 14px;\
  border: none;\
  background-color: #4caf50;\
  color: white;\
  border-radius: 6px;\
  cursor: pointer;\
\}\
\
#submit-meaning:hover \{\
  background-color: #45a049;\
\}\
\
#sort-buttons \{\
  margin-top: 15px;\
\}\
\
#sort-buttons button \{\
  margin-right: 10px;\
  padding: 6px 12px;\
  font-size: 14px;\
  border: 1px solid #aaa;\
  border-radius: 5px;\
  background: #f4f4f4;\
  cursor: pointer;\
\}\
\
#sort-buttons .active-sort \{\
  background: #2196f3;\
  color: white;\
  border-color: #2196f3;\
\}\
\
#interpretations-list \{\
  list-style-type: none;\
  padding: 0;\
  margin-top: 20px;\
\}\
\
#interpretations-list li \{\
  background: none;\
  padding: 8px 4px;\
  margin-bottom: 10px;\
  border-radius: 6px;\
  display: flex;\
  justify-content: space-between;\
  align-items: center;\
\}\
\
.interp-like \{\
  background-color: #e0e0e0;\
  border: none;\
  padding: 4px 10px;\
  border-radius: 5px;\
  cursor: pointer;\
  font-size: 14px;\
\}\
\
.interp-like.liked \{\
  background-color: #ffc107;\
  color: #000;\
\}\
\
#show-all-button \{\
  margin-top: 10px;\
  padding: 8px 14px;\
  font-size: 14px;\
  background-color: #2196f3;\
  color: white;\
  border: none;\
  border-radius: 6px;\
  cursor: pointer;\
  display: none;\
\}\
\
#show-all-button:hover \{\
  background-color: #1976d2;\
\}\
\
.copy-toast \{\
  position: fixed;\
  bottom: 30px;\
  left: 50%;\
  transform: translateX(-50%);\
  background: #333;\
  color: white;\
  padding: 8px 16px;\
  border-radius: 20px;\
  opacity: 0;\
  font-size: 14px;\
  transition: opacity 0.3s ease, transform 0.3s ease;\
  z-index: 999;\
\}\
\
.copy-toast.show \{\
  opacity: 1;\
  transform: translateX(-50%) translateY(-10px);\
\}\
\
@media screen and (max-width: 768px) \{\
  .container \{\
    flex-direction: column;\
    height: auto;\
  \}\
\
  .sidebar \{\
    display: none;\
  \}\
\
  .meaning-panel \{\
    width: 100%;\
    border-left: none;\
    border-top: 1px solid #ccc;\
  \}\
\
  #emoji-search \{\
    position: sticky;\
    top: 0;\
    z-index: 10;\
    background: white;\
  \}\
\
  .emoji-buttons button \{\
    font-size: 24px;\
    padding: 8px;\
  \}\
\
  h2 \{\
    font-size: 18px;\
  \}\
\
  #emoji-description \{\
    font-size: 14px;\
  \}\
\}\
\
\pard\pardeftab560\slleading20\pardirnatural\partightenfactor0
\cf0 \
\pard\pardeftab560\sa40\partightenfactor0

\f1\b\fs32 \cf0 EmojiData:\uc0\u8232 \
\pard\pardeftab560\slleading20\partightenfactor0

\f2\b0\fs26 \cf0 // \uc0\u9989  \u23566 \u20986  emojiCategories \u32102  script.js \u20351 \u29992 \
window.emojiCategories = \{\
    "Smileys & Emotion": [\
      \{ emoji: "\uc0\u55357 \u56834 ", name: "Face with Tears of Joy", meaning: "Uncontrollable laughter, something extremely funny or absurd." \},\
      \{ emoji: "\uc0\u55358 \u56611 ", name: "Rolling on the Floor Laughing", meaning: "Hysterical laughter, intensified humour." \},\
      \{ emoji: "\uc0\u55357 \u56842 ", name: "Smiling Face with Smiling Eyes", meaning: "Genuine happiness, politeness, or satisfaction." \},\
      \{ emoji: "\uc0\u55357 \u56845 ", name: "Smiling Face with Heart-Eyes", meaning: "Love, admiration, or infatuation." \},\
      \{ emoji: "\uc0\u55357 \u56856 ", name: "Face Blowing a Kiss", meaning: "Affection, flirting, or gratitude." \},\
      \{ emoji: "\uc0\u55357 \u56866 ", name: "Crying Face", meaning: "Sadness, sympathy, or emotional response." \},\
      \{ emoji: "\uc0\u55357 \u56877 ", name: "Loudly Crying Face", meaning: "Grief, intense emotion, or catharsis." \},\
      \{ emoji: "\uc0\u55357 \u56837 ", name: "Smiling Face with Sweat", meaning: "Relief, embarrassment, or awkwardness." \},\
      \{ emoji: "\uc0\u55357 \u56833 ", name: "Beaming Face with Smiling Eyes", meaning: "Excitement, friendliness, or accomplishment." \},\
      \{ emoji: "\uc0\u55357 \u56838 ", name: "Grinning Squinting Face", meaning: "Intense amusement, silliness, or wild joy." \},\
      \{ emoji: "\uc0\u55357 \u56846 ", name: "Smiling Face with Sunglasses", meaning: "Coolness, confidence, or laid-back vibe." \},\
      \{ emoji: "\uc0\u55357 \u56839 ", name: "Smiling Face with Halo", meaning: "Innocence, angelic behaviour, or virtue." \},\
      \{ emoji: "\uc0\u55358 \u56688 ", name: "Smiling Face with Hearts", meaning: "Feeling loved, gratitude, or affection overload." \},\
      \{ emoji: "\uc0\u55357 \u56843 ", name: "Face Savoring Food", meaning: "Deliciousness, appetite, or food pleasure." \},\
      \{ emoji: "\uc0\u55357 \u56860 ", name: "Winking Face with Tongue", meaning: "Silliness, teasing, or mischief." \}\
    ],\
  \
    "Gestures & People": [\
      \{ emoji: "\uc0\u55357 \u56911 ", name: "Folded Hands", meaning: "Prayer, gratitude, or hope." \},\
      \{ emoji: "\uc0\u55357 \u56399 ", name: "Clapping Hands", meaning: "Applause, appreciation, or recognition." \},\
      \{ emoji: "\uc0\u55357 \u56397 ", name: "Thumbs Up", meaning: "Approval, agreement, or encouragement." \},\
      \{ emoji: "\uc0\u55357 \u56384 ", name: "Eyes", meaning: "Attention, interest, or keeping watch." \},\
      \{ emoji: "\uc0\u55357 \u56908 ", name: "Raising Hands", meaning: "Celebration, praise, or success." \},\
      \{ emoji: "\uc0\u55358 \u56631 ", name: "Person Shrugging", meaning: "Indifference, uncertainty, or resignation." \},\
      \{ emoji: "\uc0\u55357 \u56449 ", name: "Person Tipping Hand", meaning: "Helpfulness, sassiness, or explanation." \},\
      \{ emoji: "\uc0\u55358 \u56614 ", name: "Person Facepalming", meaning: "Frustration, embarrassment, or disbelief." \},\
      \{ emoji: "\uc0\u55358 \u56605 ", name: "Handshake", meaning: "Agreement, deal, or unity." \},\
      \{ emoji: "\uc0\u55358 \u56606 ", name: "Crossed Fingers", meaning: "Hope, luck, or good wishes." \},\
      \{ emoji: "\uc0\u55357 \u56395 ", name: "Waving Hand", meaning: "Greeting, farewell, or attention." \},\
      \{ emoji: "\uc0\u55358 \u56601 ", name: "Call Me Hand", meaning: "Call me, chill, or island vibe." \},\
      \{ emoji: "\uc0\u55357 \u56394 ", name: "Oncoming Fist", meaning: "Fist bump, solidarity, or strength." \},\
      \{ emoji: "\uc0\u55358 \u56600 ", name: "Sign of the Horns", meaning: "Rock on, energy, or rebellion." \},\
      \{ emoji: "\uc0\u55358 \u57078 ", name: "Heart Hands", meaning: "Love, support, or emotional connection." \}\
    ],\
  \
    "Hearts": [\
      \{ emoji: "\uc0\u10084 \u65039 ", name: "Red Heart", meaning: "Romantic love, deep emotional connection." \},\
      \{ emoji: "\uc0\u55357 \u56468 ", name: "Broken Heart", meaning: "Heartbreak, sadness, or emotional pain." \},\
      \{ emoji: "\uc0\u55357 \u56470 ", name: "Sparkling Heart", meaning: "Radiant love, admiration, or enthusiasm." \},\
      \{ emoji: "\uc0\u55357 \u56469 ", name: "Two Hearts", meaning: "Bonding, mutual affection, or togetherness." \},\
      \{ emoji: "\uc0\u55357 \u56471 ", name: "Growing Heart", meaning: "Blossoming love or affection." \},\
      \{ emoji: "\uc0\u55357 \u56472 ", name: "Heart with Arrow", meaning: "Love struck, desire, or romantic pursuit." \},\
      \{ emoji: "\uc0\u55357 \u56477 ", name: "Heart with Ribbon", meaning: "Gift of love or a special relationship." \},\
      \{ emoji: "\uc0\u55357 \u56467 ", name: "Beating Heart", meaning: "Heartbeat, excitement, or passion." \},\
      \{ emoji: "\uc0\u55357 \u56478 ", name: "Revolving Hearts", meaning: "Mutual love or relationship flow." \},\
      \{ emoji: "\uc0\u55357 \u56479 ", name: "Heart Decoration", meaning: "Love symbol or embellishment." \},\
      \{ emoji: "\uc0\u55358 \u56801 ", name: "Orange Heart", meaning: "Warmth, care, or friendship." \},\
      \{ emoji: "\uc0\u55357 \u56475 ", name: "Yellow Heart", meaning: "Happiness, optimism, or joy." \},\
      \{ emoji: "\uc0\u55357 \u56474 ", name: "Green Heart", meaning: "Harmony, nature, or healing." \},\
      \{ emoji: "\uc0\u55357 \u56473 ", name: "Blue Heart", meaning: "Loyalty, trust, or peace." \},\
      \{ emoji: "\uc0\u55357 \u56476 ", name: "Purple Heart", meaning: "Devotion, honour, or compassion." \}\
    ],\
  \
    "Symbols & Fun": [\
      \{ emoji: "\uc0\u55357 \u56613 ", name: "Fire", meaning: "Excitement, passion, or trendiness." \},\
      \{ emoji: "\uc0\u55357 \u56495 ", name: "Hundred Points", meaning: "Perfection, full effort, or high achievement." \},\
      \{ emoji: "\uc0\u55356 \u57225 ", name: "Party Popper", meaning: "Celebration, joy, or success." \},\
      \{ emoji: "\uc0\u55357 \u56481 ", name: "Light Bulb", meaning: "Idea, creativity, or insight." \},\
      \{ emoji: "\uc0\u55358 \u56596 ", name: "Thinking Face", meaning: "Thoughtfulness, doubt, or analysis." \},\
      \{ emoji: "\uc0\u10004 \u65039 ", name: "Check Mark", meaning: "Confirmation, approval, or correctness." \},\
      \{ emoji: "\uc0\u10071 ", name: "Exclamation Mark", meaning: "Urgency, importance, or alert." \},\
      \{ emoji: "\uc0\u9989 ", name: "Check Mark Button", meaning: "Success, completion, or agreement." \},\
      \{ emoji: "\uc0\u55357 \u56596 ", name: "Bell", meaning: "Notification, reminder, or attention." \},\
      \{ emoji: "\uc0\u55356 \u57088 ", name: "Cyclone", meaning: "Swirl, motion, or confusion." \},\
      \{ emoji: "\uc0\u11088 ", name: "Star", meaning: "Achievement, excellence, or admiration." \},\
      \{ emoji: "\uc0\u55356 \u57096 ", name: "Rainbow", meaning: "Hope, diversity, or LGBTQ+ pride." \},\
      \{ emoji: "\uc0\u9889 ", name: "High Voltage", meaning: "Energy, power, or excitement." \},\
      \{ emoji: "\uc0\u9728 \u65039 ", name: "Sun", meaning: "Brightness, positivity, or summer." \},\
      \{ emoji: "\uc0\u55356 \u57113 ", name: "Moon", meaning: "Night, mystery, or tranquillity." \}\
    ],\
    \
    "Animals & Nature": [\
        \{ emoji: "\uc0\u55357 \u56374 ", name: "Dog Face", meaning: "Loyalty, playfulness, or companionship." \},\
        \{ emoji: "\uc0\u55357 \u56369 ", name: "Cat Face", meaning: "Curiosity, independence, or cuteness." \},\
        \{ emoji: "\uc0\u55357 \u56379 ", name: "Bear Face", meaning: "Strength, comfort, or wild nature." \},\
        \{ emoji: "\uc0\u55358 \u56705 ", name: "Lion Face", meaning: "Courage, pride, or leadership." \},\
        \{ emoji: "\uc0\u55357 \u56368 ", name: "Rabbit Face", meaning: "Innocence, speed, or fertility." \},\
        \{ emoji: "\uc0\u55358 \u56714 ", name: "Fox Face", meaning: "Cleverness, trickery, or sly behaviour." \},\
        \{ emoji: "\uc0\u55357 \u56380 ", name: "Panda Face", meaning: "Gentleness, conservation, or peace." \},\
        \{ emoji: "\uc0\u55357 \u56376 ", name: "Frog Face", meaning: "Transformation, freshness, or humour." \},\
        \{ emoji: "\uc0\u55357 \u56340 ", name: "Chicken", meaning: "Cowardice, routine, or farm life." \},\
        \{ emoji: "\uc0\u55357 \u56354 ", name: "Turtle", meaning: "Wisdom, patience, or longevity." \}\
      ],\
    \
      "Food & Drink": [\
        \{ emoji: "\uc0\u55356 \u57166 ", name: "Red Apple", meaning: "Health, temptation, or education." \},\
        \{ emoji: "\uc0\u55356 \u57173 ", name: "Pizza", meaning: "Indulgence, comfort food, or casual dining." \},\
        \{ emoji: "\uc0\u55356 \u57172 ", name: "Hamburger", meaning: "Fast food culture or American cuisine." \},\
        \{ emoji: "\uc0\u55356 \u57187 ", name: "Sushi", meaning: "Delicacy, refinement, or Japanese culture." \},\
        \{ emoji: "\uc0\u55356 \u57193 ", name: "Doughnut", meaning: "Sweetness, cheat day, or reward." \},\
        \{ emoji: "\uc0\u55356 \u57194 ", name: "Cookie", meaning: "Treat, childhood, or comfort." \},\
        \{ emoji: "\uc0\u55356 \u57159 ", name: "Grapes", meaning: "Abundance, nature, or luxury." \},\
        \{ emoji: "\uc0\u55356 \u57200 ", name: "Cake", meaning: "Celebration, reward, or indulgence." \},\
        \{ emoji: "\uc0\u55356 \u57180 ", name: "Steaming Bowl", meaning: "Warmth, comfort, or Asian cuisine." \},\
        \{ emoji: "\uc0\u9749 ", name: "Hot Beverage", meaning: "Relaxation, routine, or productivity." \}\
      ],\
    \
      "Objects": [\
        \{ emoji: "\uc0\u55357 \u56561 ", name: "Mobile Phone", meaning: "Communication, connection, or modern life." \},\
        \{ emoji: "\uc0\u55357 \u56507 ", name: "Laptop", meaning: "Work, creativity, or digital presence." \},\
        \{ emoji: "\uc0\u55357 \u56567 ", name: "Camera", meaning: "Memories, creativity, or observation." \},\
        \{ emoji: "\uc0\u55356 \u57255 ", name: "Headphone", meaning: "Focus, solitude, or entertainment." \},\
        \{ emoji: "\uc0\u55357 \u56687 \u65039 ", name: "Candle", meaning: "Hope, remembrance, or atmosphere." \},\
        \{ emoji: "\uc0\u55357 \u56538 ", name: "Books", meaning: "Knowledge, learning, or exploration." \},\
        \{ emoji: "\uc0\u55356 \u57217 ", name: "Wrapped Gift", meaning: "Surprise, generosity, or celebration." \},\
        \{ emoji: "\uc0\u55357 \u56524 ", name: "Pushpin", meaning: "Reminder, attention, or location." \},\
        \{ emoji: "\uc0\u55358 \u56824 ", name: "Teddy Bear", meaning: "Childhood, comfort, or nostalgia." \},\
        \{ emoji: "\uc0\u55357 \u56593 ", name: "Key", meaning: "Access, control, or security." \}\
      ]\
    \};\
\'df\
window.emojiCategories = emojiCategories; // 
\f3 \uc0\u9989 
\f2  
\f4 \'a6\'50\'ae\'c9\'b1\'be\'a8\'ec\'a5\'fe\'b0\'ec
\f2  window 
\f4 \'a4\'57\'a8\'d1\'a8\'e4\'a5\'4c
\f2  script 
\f4 \'a8\'cf\'a5\'ce
\f2 \
\
\
\
\
\
\
\
\uc0\u31532 \u20108 \u29256 :\
Index:\
\pard\pardeftab560\slleading20\partightenfactor0
\cf0 <!DOCTYPE html>\
<html lang="en">\
<head>\
  <meta charset="UTF-8" />\
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>\
  <title>Emoji Meaning Explorer</title>\
  <link rel="stylesheet" href="style.css" />\
</head>\
<body>\
  <div class="site-header">\
    <h1>Emoji Meaning Explorer</h1>\
    <p class="site-subtitle">Find, share, and vote on emoji meanings \'96 together.</p>\
  </div>\
\
  <div class="container">\
    <nav class="sidebar" id="categoryMenu"></nav>\
\
    <div class="content">\
      <input type="text" id="emoji-search" placeholder="Search emoji or meaning..." />\
      <main id="emojiContainer"></main>\
    </div>\
\
    <aside class="meaning-panel" id="emoji-details" style="display: none;">\
      <h2 id="emoji-title"></h2>\
\
      <ul id="interpretations-list">\
        <!-- Interpretations will be injected here -->\
      </ul>\
\
      <button id="show-all-button" style="display: none;">Show all</button>\
\
      <div class="submit-section">\
        <input id="user-input" placeholder="Add your interpretation..." />\
        <button id="submit-meaning">Submit</button>\
      </div>\
    </aside>\
  </div>\
\
  <div class="copy-toast" id="copy-toast">Emoji copied!</div>\
\
  <script src="emojiData.js"></script>\
  <script src="script.js"></script>\
</body>\
</html>\
\
\
\
\
\
\
Script:\
function generateUUID() \{\
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) \{\
    const r = Math.random() * 16 | 0;\
    const v = c === 'x' ? r : (r & 0x3 | 0x8);\
    return v.toString(16);\
  \});\
\}\
\
const emojiContainer = document.getElementById("emojiContainer");\
const categoryMenu = document.getElementById("categoryMenu");\
const emojiDetails = document.getElementById("emoji-details");\
const emojiTitle = document.getElementById("emoji-title");\
const interpretationsList = document.getElementById("interpretations-list");\
const userInput = document.getElementById("user-input");\
const submitButton = document.getElementById("submit-meaning");\
const showAllButton = document.getElementById("show-all-button");\
const emojiSearch = document.getElementById("emoji-search");\
\
let currentEmoji = null;\
let allInterpretations = JSON.parse(localStorage.getItem("allInterpretations") || "\{\}");\
\
function getVoteStorage() \{\
  return JSON.parse(localStorage.getItem("emojiVotes") || "\{\}");\
\}\
\
function saveVoteStorage(storage) \{\
  localStorage.setItem("emojiVotes", JSON.stringify(storage));\
\}\
\
function saveInterpretations() \{\
  localStorage.setItem("allInterpretations", JSON.stringify(allInterpretations));\
\}\
\
function getOwnInterpretationIDs() \{\
  return JSON.parse(localStorage.getItem("ownInterpIDs") || "\{\}");\
\}\
\
function saveOwnInterpretationIDs(data) \{\
  localStorage.setItem("ownInterpIDs", JSON.stringify(data));\
\}\
\
function renderEmojiCategories() \{\
  for (const category in window.emojiCategories) \{\
    const section = document.createElement("section");\
    section.classList.add("emoji-category");\
    section.id = category.replace(/\\s+/g, "-");\
\
    const title = document.createElement("h2");\
    title.textContent = category;\
    section.appendChild(title);\
\
    const buttonWrapper = document.createElement("div");\
    buttonWrapper.className = "emoji-buttons";\
\
    window.emojiCategories[category].forEach((\{ emoji, name, meaning \}) => \{\
      const button = document.createElement("button");\
      button.textContent = emoji;\
      button.title = name;\
      button.onclick = () => showEmojiDetails(emoji, name, meaning);\
      buttonWrapper.appendChild(button);\
    \});\
\
    section.appendChild(buttonWrapper);\
    emojiContainer.appendChild(section);\
\
    const menuItem = document.createElement("a");\
    menuItem.href = "#" + section.id;\
    menuItem.textContent = category;\
    categoryMenu.appendChild(menuItem);\
  \}\
\}\
\
function showEmojiDetails(emoji, name, meaning) \{\
  currentEmoji = emoji;\
  emojiTitle.innerHTML = ""; // \uc0\u28165 \u31354 \u21407 \u26377 \u20839 \u23481 \
const emojiNode = document.createTextNode(emoji + " ");\
const strongNode = document.createElement("strong");\
strongNode.textContent = name;\
emojiTitle.appendChild(emojiNode);\
emojiTitle.appendChild(strongNode);\
\
\
  if (!allInterpretations[emoji]) \{\
    allInterpretations[emoji] = [\
      \{ text: meaning, likes: 0, isOfficial: true, id: Date.now() \}\
    ];\
    saveInterpretations();\
  \}\
\
  renderInterpretations(emoji);\
  emojiDetails.style.display = "block";\
\}\
\
function renderInterpretations(emoji, showAll = false) \{\
  interpretationsList.innerHTML = "";\
\
  const interpretations = [...(allInterpretations[emoji] || [])];\
  const voteData = getVoteStorage();\
  const voteSet = new Set(voteData[emoji] || []);\
  const ownIDs = getOwnInterpretationIDs();\
  const ownSet = new Set(ownIDs[emoji] || []);\
\
  const itemsToRender = showAll ? interpretations : interpretations.slice(0, 3);\
\
  itemsToRender.forEach((interp, index) => \{\
    const li = document.createElement("li");\
\
    const text = document.createElement("span");\
    text.textContent = `$\{index + 1\}. $\{interp.text\}`;\
\
    const like = document.createElement("button");\
    like.textContent = "\uc0\u55357 \u56397  " + interp.likes;\
    like.className = "interp-like";\
\
    if (voteSet.has(interp.id)) \{\
      like.classList.add("liked");\
    \}\
\
    like.onclick = () => \{\
      const storage = getVoteStorage();\
      const userVotes = new Set(storage[emoji] || []);\
      if (userVotes.has(interp.id)) \{\
        interp.likes--;\
        userVotes.delete(interp.id);\
      \} else \{\
        interp.likes++;\
        userVotes.add(interp.id);\
      \}\
      storage[emoji] = Array.from(userVotes);\
      saveVoteStorage(storage);\
      saveInterpretations();\
      renderInterpretations(emoji, showAll);\
    \};\
\
    li.appendChild(text);\
    li.appendChild(like);\
\
    if (!interp.isOfficial && ownSet.has(interp.id)) \{\
      const del = document.createElement("button");\
      del.innerHTML = "\uc0\u10060 ";\
      del.className = "interp-delete";\
      del.onclick = () => \{\
        if (confirm("Are you sure you want to delete this interpretation? This action cannot be undone.")) \{\
          allInterpretations[emoji] = allInterpretations[emoji].filter((x) => x.id !== interp.id);\
          ownIDs[emoji] = ownIDs[emoji].filter((id) => id !== interp.id);\
          saveOwnInterpretationIDs(ownIDs);\
          saveInterpretations();\
          renderInterpretations(emoji, showAll);\
        \}\
      \};\
      li.appendChild(del);\
    \}\
\
    interpretationsList.appendChild(li);\
  \});\
\
  showAllButton.style.display = interpretations.length > 3 && !showAll ? "block" : "none";\
\}\
\
showAllButton.onclick = () => \{\
  if (currentEmoji) \{\
    renderInterpretations(currentEmoji, true);\
  \}\
\};\
\
submitButton.onclick = () => \{\
  const value = userInput.value.trim();\
  if (!value || !currentEmoji) return;\
\
  const newInterpretation = \{\
    text: value,\
    likes: 0,\
    isOfficial: false,\
    id: generateUUID()\
  \};\
\
  if (!allInterpretations[currentEmoji]) \{\
    allInterpretations[currentEmoji] = [];\
  \}\
  allInterpretations[currentEmoji].push(newInterpretation);\
  saveInterpretations();\
\
  const ownIDs = getOwnInterpretationIDs();\
  if (!ownIDs[currentEmoji]) \{\
    ownIDs[currentEmoji] = [];\
  \}\
  ownIDs[currentEmoji].push(newInterpretation.id);\
  saveOwnInterpretationIDs(ownIDs);\
\
  userInput.value = "";\
  renderInterpretations(currentEmoji);\
\};\
\
emojiSearch.addEventListener("input", function () \{\
  const search = this.value.toLowerCase();\
  const buttons = document.querySelectorAll(".emoji-buttons button");\
  buttons.forEach((btn) => \{\
    const name = btn.title.toLowerCase();\
    const emoji = btn.textContent;\
    btn.style.display =\
      name.includes(search) || emoji.includes(search) ? "inline-block" : "none";\
  \});\
\});\
\
renderEmojiCategories();\
\
\
Style:\
body \{\
  font-family: Arial, sans-serif;\
  margin: 0;\
  background-color: #f9f9f9;\
  color: #333;\
\}\
\
.site-header \{\
  background: #ffffff;\
  padding: 1.5rem 2rem 1rem;\
  border-bottom: 1px solid #ddd;\
  text-align: center;\
\}\
\
.site-header h1 \{\
  margin: 0;\
  font-size: 2rem;\
\}\
\
.site-subtitle \{\
  color: #777;\
  font-size: 1rem;\
  margin-top: 0.5rem;\
\}\
\
.container \{\
  display: flex;\
  height: calc(100vh - 120px);\
  overflow: hidden;\
\}\
\
.sidebar \{\
  width: 200px;\
  background-color: #fff;\
  border-right: 1px solid #ddd;\
  padding: 1rem;\
  overflow-y: auto;\
\}\
\
.sidebar a \{\
  display: block;\
  margin-bottom: 1rem;\
  color: #007BFF;\
  text-decoration: none;\
  font-weight: bold;\
\}\
\
.sidebar a:hover \{\
  text-decoration: underline;\
\}\
\
.content \{\
  flex: 1;\
  padding: 1.5rem;\
  overflow-y: auto;\
\}\
\
#emoji-search \{\
  width: 100%;\
  padding: 10px;\
  margin-bottom: 1.5rem;\
  font-size: 16px;\
  border: 1px solid #ccc;\
  border-radius: 6px;\
\}\
\
.emoji-category \{\
  margin-bottom: 2rem;\
\}\
\
.emoji-category h2 \{\
  margin-bottom: 0.5rem;\
  font-size: 1.25rem;\
\}\
\
.emoji-buttons \{\
  display: flex;\
  flex-wrap: wrap;\
  gap: 10px;\
\}\
\
.emoji-buttons button \{\
  font-size: 28px;\
  padding: 10px;\
  cursor: pointer;\
  background: #fff;\
  border: 1px solid #ccc;\
  border-radius: 8px;\
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);\
  transition: transform 0.1s ease;\
\}\
\
.emoji-buttons button:hover \{\
  transform: scale(1.2);\
\}\
\
.meaning-panel \{\
  width: 320px;\
  background-color: #ffffff;\
  border-left: 1px solid #ddd;\
  padding: 1rem;\
  overflow-y: auto;\
\}\
\
.meaning-panel h2 \{\
  margin-top: 0;\
\}\
\
#emoji-description \{\
  font-size: 16px;\
  margin-bottom: 10px;\
\}\
\
#user-input \{\
  width: 100%;\
  padding: 10px;\
  font-size: 16px;\
  margin: 10px 0;\
  border-radius: 6px;\
  border: 1px solid #ccc;\
\}\
\
#submit-meaning \{\
  padding: 8px 16px;\
  font-size: 14px;\
  border: none;\
  background-color: #4caf50;\
  color: white;\
  border-radius: 6px;\
  cursor: pointer;\
\}\
\
#submit-meaning:hover \{\
  background-color: #45a049;\
\}\
\
#sort-buttons \{\
  margin-top: 15px;\
\}\
\
#sort-buttons button \{\
  margin-right: 10px;\
  padding: 6px 12px;\
  font-size: 14px;\
  border: 1px solid #aaa;\
  border-radius: 5px;\
  background: #f4f4f4;\
  cursor: pointer;\
\}\
\
#sort-buttons .active-sort \{\
  background: #2196f3;\
  color: white;\
  border-color: #2196f3;\
\}\
\
#interpretations-list \{\
  list-style-type: none;\
  padding: 0;\
  margin-top: 20px;\
\}\
\
#interpretations-list li \{\
  background: #f1f1f1;\
  padding: 10px;\
  margin-bottom: 10px;\
  border-radius: 6px;\
  display: flex;\
  justify-content: space-between;\
  align-items: center;\
\}\
\
#interpretations-list li span \{\
  flex: 1;\
  font-size: 15px;\
\}\
\
.interp-like \{\
  background-color: #e0e0e0;\
  border: none;\
  padding: 4px 10px;\
  border-radius: 5px;\
  cursor: pointer;\
  font-size: 14px;\
  margin-left: 10px;\
\}\
\
.interp-like.liked \{\
  background-color: #ffc107;\
  color: #000;\
\}\
\
.interp-delete \{\
  background-color: #ff4444;\
  color: white;\
  border: none;\
  padding: 4px 10px;\
  border-radius: 5px;\
  font-size: 14px;\
  cursor: pointer;\
  margin-left: 10px;\
\}\
\
.interp-delete:hover \{\
  background-color: #d32f2f;\
\}\
\
#show-all-button \{\
  margin-top: 10px;\
  padding: 8px 14px;\
  font-size: 14px;\
  background-color: #2196f3;\
  color: white;\
  border: none;\
  border-radius: 6px;\
  cursor: pointer;\
  display: none;\
\}\
\
#show-all-button:hover \{\
  background-color: #1976d2;\
\}\
\
.copy-toast \{\
  position: fixed;\
  bottom: 30px;\
  left: 50%;\
  transform: translateX(-50%);\
  background: #333;\
  color: white;\
  padding: 8px 16px;\
  border-radius: 20px;\
  opacity: 0;\
  font-size: 14px;\
  transition: opacity 0.3s ease, transform 0.3s ease;\
  z-index: 999;\
\}\
\
.copy-toast.show \{\
  opacity: 1;\
  transform: translateX(-50%) translateY(-10px);\
\}\
\
@media screen and (max-width: 768px) \{\
  .container \{\
    flex-direction: column;\
    height: auto;\
  \}\
\
  .sidebar \{\
    display: none;\
  \}\
\
  .meaning-panel \{\
    width: 100%;\
    border-left: none;\
    border-top: 1px solid #ccc;\
  \}\
\
  #emoji-search \{\
    position: sticky;\
    top: 0;\
    z-index: 10;\
    background: white;\
  \}\
\
  .emoji-buttons button \{\
    font-size: 24px;\
    padding: 8px;\
  \}\
\
  h2 \{\
    font-size: 18px;\
  \}\
\
  #emoji-description \{\
    font-size: 14px;\
  \}\
\}\
\

\f5\fs24 \cf2 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 \
\pard\pardeftab720\partightenfactor0
\cf2 \
\
}