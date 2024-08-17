const skillsBadges = document.getElementById("skill-badges");
const addButton = document.getElementById("expert-add-skill");
const skillInput = document.getElementById("expert-skill-input");
const skillError = document.getElementById("expert-skill-err");
const expertSignUpError = document.getElementById("expert-sign-up-err");
const expertImages = document.getElementById("expert-images");
const imageInput = document.getElementById("expert-upload");
const expertForm = document.getElementById("expert-form");
const textCount = document.getElementById("text-area-count");
const expertAdress = document.getElementById("expert-adress-input");
const expertBio = document.getElementById("expert-bio");
const cancelEdit = document.getElementById("cancel-edit");

cancelEdit.addEventListener("click", () => {
  if (isEdit) {
    document.location.href = "/expert";
  } else {
    document.location.href = "/user";
  }
});

let expert = {
  userId: "",
  bio: "",
  skills: [],
  location: "",
  images: [],
};

const newSkillBadge = (skill) => {
  const item = document.createElement("li");
  item.innerHTML = skill;
  item.classList.add(
    "badge",
    "fs-6",
    "p-2",
    "badge-pill",
    "bg-primary",
    "position-relative",
    "button",
    "cursor-pointer"
  );
  item.addEventListener("click", () => {
    skillsBadges.removeChild(item);
    expert.skills = expert.skills.filter((sk) => sk !== skill);
  });
  return item;
};

const newExpertImage = (url) => {
  const item = document.createElement("li");
  const img = document.createElement("img");
  img.src = url;
  img.classList.add("expert-image-preview");
  item.appendChild(img);
  item.classList.add("expert-image-preview-wrapper");
  item.addEventListener("click", () => {
    expert.images = expert.images.filter((i) => i !== url);
    item.remove();
  });
  return item;
};

if (isEdit && currentExpert) {
  expert.userId = user._id;
  expertBio.value = currentExpert.bio;
  expert.bio = currentExpert.bio;
  expertAdress.value = currentExpert.location;
  expert.location = currentExpert.location;
  for (let url of currentExpert.images) {
    expertImages.appendChild(newExpertImage(url));
    expert.images.push(url);
  }
  for (let skill of currentExpert.skills) {
    expert.skills.push(skill);
    skillsBadges.appendChild(newSkillBadge(skill));
  }

  textCount.innerHTML = `${expertBio.value.length}/500`;
}

expertBio.addEventListener("input", () => {
  expert.bio = expertBio.value.trim();
  expertSignUpError.style.display = "none";
  textCount.innerHTML = `${expertBio.value.length}/500`;
});

skillInput.addEventListener("focus", () => {
  expertSignUpError.style.display = "none";
  skillError.style.display = "none";
});

addButton.addEventListener("click", () => {
  expertSignUpError.style.display = "none";
  let curVal = skillInput.value;
  try {
    if (!curVal || curVal.length === 0 || curVal.trim().length === "") {
      throw new Error("No input skill");
    }
    curVal = curVal.toLowerCase().trim();
    if (curVal.length < 2 || curVal.length > 25) {
      throw new Error("Skill must be more than 2 and less than 25 characters");
    }
    if (expert.skills.includes(curVal)) {
      throw new Error("Skill has already exist");
    }
    expert.skills.push(curVal);
    skillsBadges.appendChild(newSkillBadge(curVal));
  } catch (e) {
    skillError.innerHTML = e.message;
    skillError.style.display = "block";
  } finally {
    skillInput.value = "";
  }
});
imageInput.addEventListener("uploadChange", (e) => {
  let url = imageInput.value.trim();
  if (url.length > 0) {
    expertImages.appendChild(newExpertImage(url));
    expert.images.push(url);
  }
});

expertAdress.addEventListener("input", () => {
  expert.location = expertAdress.value.trim();
});

const checkXSS = (expert) => {
  return {
    userId: filterXSS(expert.userId),
    bio: filterXSS(expert.bio),
    skills: filterXSS(expert.skills),
    location: filterXSS(expert.location),
    images: filterXSS(expert.images),
  };
};

expertForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let expertChecked = checkXSS(expert);
  expertChecked.userId = user._id;
  try {
    if (expertChecked.bio.length < 10) {
      throw new Error(
        "Bio must be more than 10 and less and equal than 500 characters"
      );
    }
    if (
      expertChecked.location.length < 5 ||
      expertChecked.location.length > 50
    ) {
      throw new Error("Location should be more than 5 characters");
    }
    if (expertChecked.skills.length === 0) {
      throw new Error("Please add at least one skill");
    }
    if (expertChecked.images.length === 0) {
      throw new Error("Please upload images of your shop or brand");
    }
    if (expertChecked.userId.length === 0) {
      window.location.replace("/user/login");
    }

    if (isEdit) {
      const res = await fetch("/api/expert", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expertChecked),
      });
      if (res.ok) {
        document.location.replace("/expert");
      } else {
        const json = await res.json();
        throw new Error(json.content || "An error occurred");
      }
    } else {
      const res = await fetch("/api/expert", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expertChecked),
      });
      if (res.ok) {
        document.location.replace("/expert");
      } else {
        const json = await res.json();
        throw new Error(json.content || "An error occurred");
      }
    }
  } catch (e) {
    expertSignUpError.innerHTML = e.message;
    expertSignUpError.style.display = "block";
  }
});
