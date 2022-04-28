document.addEventListener('DOMContentLoaded', function () {
    const clearBtn = document.querySelectorAll(".clear-btn");
    clearBtn.forEach((btn) => {
        btn.addEventListener("click", function () {
            const target = btn.dataset.target;
            document.querySelector(target).textContent = "";
        })
    })
    document.getElementById("convertform").addEventListener("submit", (e)=> {
        const t = document.getElementById("to_convert").textContent;
        document.getElementById("convertform-text").value = escapeHtml(t);
    })
});

const printResults = (result) => {
    // Read result of the Cloud Function.
    result.data.forEach(element => {
        const newDiv = document.createElement("div");
        const newContent = document.createTextNode(element.result);
        const newH = document.createElement("h3");
        newH.textContent = element.conversion;
        newDiv.appendChild(newH);
        newDiv.appendChild(newContent);
        const newInfo = document.createElement("div");
        for (const [key, value] of Object.entries(element.stats)) {
            newInfo.textContent += `${key}: ${value}, `;
        }
        newDiv.appendChild(newInfo);
        const currentDiv = document.getElementById("results");
        document.body.insertBefore(newDiv, currentDiv);
    });
};

const escapeHtml = (string) => {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }