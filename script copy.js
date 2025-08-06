function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const emojiContainer = document.getElementById("emojiContainer");
const categoryMenu = document.getElementById("categoryMenu");
const emojiDetails = document.getElementById("emoji-details");
const emojiTitle = document.getElementById("emoji-title");
const interpretationsList = document.getElementById("interpretations-list");
const userInput = document.getElementById("user-input");
const submitButton = document.getElementById("submit-meaning");
const showAllButton = document.getElementById("show-all-button");
const emojiSearch = document.getElementById("emoji-search");

let currentEmoji = null;
let allInterpretations = JSON.parse(localStorage.getItem("allInterpretations") || "{}");

function getVoteStorage() {
  return JSON.parse(localStorage.getItem("emojiVotes") || "{}");
}

function saveVoteStorage(storage) {
  localStorage.setItem("emojiVotes", JSON.stringify(storage));
}

function saveInterpretations() {
  localStorage.setItem("allInterpretations", JSON.stringify(allInterpretations));
}

function getOwnInterpretationIDs() {
  return JSON.parse(localStorage.getItem("ownInterpIDs") || "{}");
}

function saveOwnInterpretationIDs(data) {
  localStorage.setItem("ownInterpIDs", JSON.stringify(data));
}

function renderEmojiCategories() {
  for (const category in window.emojiCategories) {
    const section = document.createElement("section");
    section.classList.add("emoji-category");
    section.id = category.replace(/\s+/g, "-");

    const title = document.createElement("h2");
    title.textContent = category;
    section.appendChild(title);

    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "emoji-buttons";

    window.emojiCategories[category].forEach(({ emoji, name, meaning }) => {
      const button = document.createElement("button");
      button.textContent = emoji;
      button.title = name;
      button.onclick = () => showEmojiDetails(emoji, name, meaning);
      buttonWrapper.appendChild(button);
    });

    section.appendChild(buttonWrapper);
    emojiContainer.appendChild(section);

    const menuItem = document.createElement("a");
    menuItem.href = "#" + section.id;
    menuItem.textContent = category;
    categoryMenu.appendChild(menuItem);
  }
}

function showEmojiDetails(emoji, name, meaning) {
  currentEmoji = emoji;
  emojiTitle.innerHTML = ""; // 清空原有內容
const emojiNode = document.createTextNode(emoji + " ");
const strongNode = document.createElement("strong");
strongNode.textContent = name;
emojiTitle.appendChild(emojiNode);
emojiTitle.appendChild(strongNode);


  if (!allInterpretations[emoji]) {
    allInterpretations[emoji] = [
      { text: meaning, likes: 0, isOfficial: true, id: Date.now() }
    ];
    saveInterpretations();
  }

  renderInterpretations(emoji);
  emojiDetails.style.display = "block";
}

function renderInterpretations(emoji, showAll = false) {
  interpretationsList.innerHTML = "";

  const interpretations = [...(allInterpretations[emoji] || [])];
  const voteData = getVoteStorage();
  const voteSet = new Set(voteData[emoji] || []);
  const ownIDs = getOwnInterpretationIDs();
  const ownSet = new Set(ownIDs[emoji] || []);

  const itemsToRender = showAll ? interpretations : interpretations.slice(0, 3);

  itemsToRender.forEach((interp, index) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = `${index + 1}. ${interp.text}`;

    const like = document.createElement("button");
    like.textContent = "👍 " + interp.likes;
    like.className = "interp-like";

    if (voteSet.has(interp.id)) {
      like.classList.add("liked");
    }

    like.onclick = () => {
      const storage = getVoteStorage();
      const userVotes = new Set(storage[emoji] || []);
      if (userVotes.has(interp.id)) {
        interp.likes--;
        userVotes.delete(interp.id);
      } else {
        interp.likes++;
        userVotes.add(interp.id);
      }
      storage[emoji] = Array.from(userVotes);
      saveVoteStorage(storage);
      saveInterpretations();
      renderInterpretations(emoji, showAll);
    };

    li.appendChild(text);
    li.appendChild(like);

    if (!interp.isOfficial && ownSet.has(interp.id)) {
      const del = document.createElement("button");
      del.innerHTML = "❌";
      del.className = "interp-delete";
      del.onclick = () => {
        if (confirm("Are you sure you want to delete this interpretation? This action cannot be undone.")) {
          allInterpretations[emoji] = allInterpretations[emoji].filter((x) => x.id !== interp.id);
          ownIDs[emoji] = ownIDs[emoji].filter((id) => id !== interp.id);
          saveOwnInterpretationIDs(ownIDs);
          saveInterpretations();
          renderInterpretations(emoji, showAll);
        }
      };
      li.appendChild(del);
    }

    interpretationsList.appendChild(li);
  });

  showAllButton.style.display = interpretations.length > 3 && !showAll ? "block" : "none";
}

showAllButton.onclick = () => {
  if (currentEmoji) {
    renderInterpretations(currentEmoji, true);
  }
};

submitButton.onclick = () => {
  const value = userInput.value.trim();
  if (!value || !currentEmoji) return;

  const newInterpretation = {
    text: value,
    likes: 0,
    isOfficial: false,
    id: generateUUID()
  };

  if (!allInterpretations[currentEmoji]) {
    allInterpretations[currentEmoji] = [];
  }
  allInterpretations[currentEmoji].push(newInterpretation);
  saveInterpretations();

  const ownIDs = getOwnInterpretationIDs();
  if (!ownIDs[currentEmoji]) {
    ownIDs[currentEmoji] = [];
  }
  ownIDs[currentEmoji].push(newInterpretation.id);
  saveOwnInterpretationIDs(ownIDs);

  userInput.value = "";
  renderInterpretations(currentEmoji);
};

emojiSearch.addEventListener("input", function () {
  const search = this.value.toLowerCase();
  const buttons = document.querySelectorAll(".emoji-buttons button");
  buttons.forEach((btn) => {
    const name = btn.title.toLowerCase();
    const emoji = btn.textContent;
    btn.style.display =
      name.includes(search) || emoji.includes(search) ? "inline-block" : "none";
  });
});

renderEmojiCategories();

// ✅ 實作輸入時更新字數顯示
const charCount = document.getElementById("char-count");

userInput.addEventListener("input", () => {
  charCount.textContent = `${userInput.value.length} / 1000`;
});
