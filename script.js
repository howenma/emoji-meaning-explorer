// ==== utils ====
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ==== DOM refs ====
const emojiContainer = document.getElementById("emojiContainer");
const categoryMenu = document.getElementById("categoryMenu");
const emojiDetails = document.getElementById("emoji-details");
const emojiTitle = document.getElementById("emoji-title");
const interpretationsList = document.getElementById("interpretations-list");
const userInput = document.getElementById("user-input");
const submitButton = document.getElementById("submit-meaning");
const showAllButton = document.getElementById("show-all-button");
const emojiSearch = document.getElementById("emoji-search");

// ==== state / storage ====
let currentEmoji = null;
let isShowingAll = false; // 展開狀態
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

// ==== category list ====
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

// ==== details panel ====
function showEmojiDetails(emoji, name, meaning) {
  currentEmoji = emoji;
  isShowingAll = false; // 換 emoji 時自動收起

  // 顯示「Emoji + 名稱」
  emojiTitle.innerHTML = "";
  const emojiNode = document.createTextNode(emoji + " ");
  const strongNode = document.createElement("strong");
  strongNode.textContent = name;
  emojiTitle.appendChild(emojiNode);
  emojiTitle.appendChild(strongNode);

  // 若無資料，建立官方詮釋（UUID）
  if (!allInterpretations[emoji]) {
    allInterpretations[emoji] = [
      { text: meaning, likes: 0, isOfficial: true, id: generateUUID() }
    ];
    saveInterpretations();
  }

  renderInterpretations(emoji, false);
  emojiDetails.style.display = "block";
}

// ==== list rendering（依讚數排序 + Top3）====
function renderInterpretations(emoji, showAll = false) {
  interpretationsList.innerHTML = "";

  // 排序：讚數多 → 少（官方與使用者一視同仁，可被擠掉）
  const interpretationsRaw = allInterpretations[emoji] || [];
  const interpretations = [...interpretationsRaw].sort((a, b) => b.likes - a.likes);

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

    if (voteSet.has(interp.id)) like.classList.add("liked");

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
      // 重新排序並維持目前 showAll 狀態
      renderInterpretations(emoji, isShowingAll);
    };

    li.appendChild(text);
    li.appendChild(like);

    // 只有「自己新增」的才可刪；官方不可刪
    if (!interp.isOfficial && ownSet.has(interp.id)) {
      const del = document.createElement("button");
      del.innerHTML = "❌";
      del.className = "interp-delete";
      del.onclick = () => {
        if (confirm("Are you sure you want to delete this interpretation? This action cannot be undone.")) {
          allInterpretations[emoji] = allInterpretations[emoji].filter((x) => x.id !== interp.id);

          const ids = getOwnInterpretationIDs();
          if (ids[emoji]) {
            ids[emoji] = ids[emoji].filter((id) => id !== interp.id);
            saveOwnInterpretationIDs(ids);
          }

          saveInterpretations();
          renderInterpretations(emoji, isShowingAll);
        }
      };
      li.appendChild(del);
    }

    interpretationsList.appendChild(li);
  });

  // 「Show all」在有超過 3 筆且目前非展開時才顯示
  showAllButton.style.display = interpretations.length > 3 && !showAll ? "block" : "none";
}

showAllButton.onclick = () => {
  if (currentEmoji) {
    isShowingAll = true;           // 標記展開狀態
    renderInterpretations(currentEmoji, true);
  }
};

// ==== submit new interpretation ====
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
  if (!ownIDs[currentEmoji]) ownIDs[currentEmoji] = [];
  ownIDs[currentEmoji].push(newInterpretation.id);
  saveOwnInterpretationIDs(ownIDs);

  userInput.value = "";
  updateCharCountAndClamp();

  // 送出屬於「任一動作」→ 自動收起
  isShowingAll = false;
  renderInterpretations(currentEmoji, false);
};

// ==== search（輸入時當作「任一動作」→ 自動收起）====
emojiSearch.addEventListener("input", function () {
  const search = this.value.toLowerCase();
  const buttons = document.querySelectorAll(".emoji-buttons button");
  buttons.forEach((btn) => {
    const name = btn.title.toLowerCase();
    const emoji = btn.textContent;
    btn.style.display =
      name.includes(search) || emoji.includes(search) ? "inline-block" : "none";
  });

  if (isShowingAll) {
    isShowingAll = false;
    if (currentEmoji) renderInterpretations(currentEmoji, false);
  }
});

renderEmojiCategories();

// ==== 點擊面板外任意處 → 自動收起 ====
document.addEventListener("click", (e) => {
  if (!isShowingAll) return;
  if (!emojiDetails.contains(e.target) && e.target !== showAllButton) {
    isShowingAll = false;
    if (currentEmoji) renderInterpretations(currentEmoji, false);
  }
});

// ==== 字數顯示 & 自動截斷 ====
const charCount = document.getElementById("char-count");

function updateCharCountAndClamp() {
  const max = 1000;
  if (userInput.value.length > max) {
    userInput.value = userInput.value.slice(0, max);
  }
  charCount.textContent = `${userInput.value.length} / ${max}`;
}
updateCharCountAndClamp();
userInput.addEventListener("input", updateCharCountAndClamp);
