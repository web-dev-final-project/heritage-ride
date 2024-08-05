const skillsBadges = document.getElementById("skill-badges");
const addButton = document.getElementById("expert-add-skill");
const skillInput = document.getElementById("expert-skill-input");
const skillError = document.getElementById("expert-sign-up-err");
const expertImages = document.getElementById("expert-images");
const skills = [];

const newSkillBadge = (skill) => {
  const item = document.createElement("li");
  item.innerHTML = skill;
  item.classList.add("badge");
  item.classList.add("p-2");
  item.classList.add("badge-pill");
  item.classList.add("bg-primary");
  return item;
};
const newExpert = (skill) => {
  const item = document.createElement("li");
  item.innerHTML = skill;
  item.classList.add("badge");
  item.classList.add("p-2");
  item.classList.add("badge-pill");
  item.classList.add("bg-primary");
  return item;
};

skillInput.addEventListener("focus", () => {
  skillError.style.display = "none";
});

addButton.addEventListener("click", () => {
  let curVal = skillInput.value;
  try {
    if (!curVal || curVal.length === 0 || curVal.trim().length === "") {
      throw new Error("No input skill");
    }
    curVal = curVal.toLowerCase().trim();
    if (curVal.length < 2 || curVal.length > 25) {
      throw new Error("Skill must be more than 2 and less than 25 characters");
    }
    if (skills.includes(curVal)) {
      throw new Error("Skill has already exist");
    }
    skills.push(curVal);
    skillsBadges.appendChild(newSkillBadge(curVal));
    skillInput.value = "";
  } catch (e) {
    skillError.innerHTML = e.message;
    skillError.style.display = "block";
  }
});
