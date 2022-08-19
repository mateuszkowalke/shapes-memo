const shapes = [
  {
    name: "circle",
    color: "#ff00ff",
    svg: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>',
  },
  {
    name: "oval",
    color: "#ff00ff",
    svg: '<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="40" ry="30"/></svg>',
  },
  {
    name: "triangle",
    color: "#ff00ff",
    svg: '<svg viewBox="0 0 100 100"><polygon points="10,90 50,10 90,90"/></svg>',
  },
  {
    name: "rectangle",
    color: "#ff00ff",
    svg: '<svg viewBox="0 0 100 100"><polygon points="10,25 10,75 90,75 90,25"/></svg>',
  },
  {
    name: "square",
    color: "#ff00ff",
    svg: '<svg viewBox="0 0 100 100"><polygon points="15,85 15,15 85,15 85,85"/></svg>',
  },
  {
    name: "diamond",
    color: "#ff00ff",
    svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 25,50 50,90 75,50"/></svg>',
  },
  {
    name: "heart",
    color: "#ff00ff",
    svg: '<svg viewBox="-50 -50 735 700"><g><path d="M 297.29747,550.86823 C 283.52243,535.43191 249.1268,505.33855 220.86277,483.99412 C 137.11867,420.75228 125.72108,411.5999 91.719238,380.29088 C 29.03471,322.57071 2.413622,264.58086 2.5048478,185.95124 C 2.5493594,147.56739 5.1656152,132.77929 15.914734,110.15398 C 34.151433,71.768267 61.014996,43.244667 95.360052,25.799457 C 119.68545,13.443675 131.6827,7.9542046 172.30448,7.7296236 C 214.79777,7.4947896 223.74311,12.449347 248.73919,26.181459 C 279.1637,42.895777 310.47909,78.617167 316.95242,103.99205 L 320.95052,119.66445 L 330.81015,98.079942 C 386.52632,-23.892986 564.40851,-22.06811 626.31244,101.11153 C 645.95011,140.18758 648.10608,223.6247 630.69256,270.6244 C 607.97729,331.93377 565.31255,378.67493 466.68622,450.30098 C 402.0054,497.27462 328.80148,568.34684 323.70555,578.32901 C 317.79007,589.91654 323.42339,580.14491 297.29747,550.86823 z"/></g></svg>',
  },
  {
    name: "star",
    color: "#ff00ff",
    svg: '<svg viewBox="0 0 100 100"><polygon points="50,10 60,40 90,40 65,60 75,90 50,70 25,90 35,60 10,40 40,40"/></svg>',
  },
];

const game = document.getElementById("game")!;
const triesCounter = document.getElementById("tries-counter")!;
let isPaused = false;
let firstPick: HTMLDivElement | null;
let matches = 0;
let tries = 0;
triesCounter.innerHTML = "" + tries;

const displayShapes = () => {
  const gameHTML = [...shapes, ...shapes]
    .sort((_) => Math.random() - 0.5)
    .map((shape, i) => {
      return `
            <div class="card" data-shapename="${shape.name}">
                <div class="front">
                    ${i + 1}
                </div>
                <div class="back rotated">
                    ${shape.svg}
                </div>
            </div>
            `;
    })
    .join("");
  game.innerHTML = gameHTML;
  Array.from(game.children).forEach((child) =>
    child.addEventListener("click", clickCard)
  );
};

const clickCard = (event: Event) => {
  const card = event.currentTarget as HTMLDivElement;
  const [front, back] = getFrontAndBackFromCard(card);

  if (front?.classList.contains("rotated") || isPaused) return;

  isPaused = true;
  rotateElements([front, back]);

  if (!firstPick) {
    firstPick = card;
    isPaused = false;
  } else {
    tries++;
    triesCounter.innerHTML = "" + tries;
    const secondShapeName = card.dataset.shapename;
    const firstShapeName = firstPick.dataset.shapename;
    // if shapes not the same flip them
    if (firstShapeName !== secondShapeName) {
      const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
      firstPick = null;
      setTimeout(() => {
        rotateElements([firstFront, firstBack, front, back]);
        isPaused = false;
      }, 1000);
    } else {
      matches++;
      if (matches === 8) {
        // need settimeout here to let the animation finish first
        // otherwise the alert blocks it
        // 500ms because transition is set to 0.5s
        setTimeout(() => {
          alert("You win!");
        }, 500);
      }
      firstPick = null;
      isPaused = false;
    }
  }
};

const getFrontAndBackFromCard = (card: HTMLDivElement): HTMLDivElement[] => {
  const front = card.querySelector(".front") as HTMLDivElement;
  const back = card.querySelector(".back") as HTMLDivElement;
  return [front, back];
};

const rotateElements = (elements: HTMLDivElement[]) => {
  elements.forEach((element) => element.classList.toggle("rotated"));
};

const resetGame = () => {
  isPaused = true;
  tries = 0;
  firstPick = null;
  matches = 0;
  game.innerHTML = "";
  triesCounter.innerHTML = "" + tries;
  setTimeout(() => {
    displayShapes();
    isPaused = false;
  }, 200);
};

const resetButton = document.getElementById("resetButton");
resetButton?.addEventListener("click", resetGame);

resetGame();

export {};
