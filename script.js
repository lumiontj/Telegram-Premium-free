document.getElementById("year").textContent = new Date().getFullYear();

let currentUserId = null;

const form = document.getElementById("premiumForm");
const status = document.getElementById("status");

// Backend URL (замените на реальный URL при размещении)
const BACKEND_URL = "http://127.0.0.1:5000";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "Отправка...";

  const formData = new FormData(form);
  const telegramId = formData.get("telegram");

  // Валидатсияи Telegram ID
  if (!/^\d+$/.test(telegramId)) {
    status.textContent = "⚠ Telegram ID должен быть числовым!";
    return;
  }

  const payload = {
    fullName: formData.get("fullName"),
    telegram: telegramId,
    instagram: formData.get("instagram") || "",
    message: formData.get("message") || ""
  };

  try {
    const res = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.status === "ok") {
      currentUserId = data.user_id;
      status.textContent = `✅ Заявка отправлена! Ваш ID: ${currentUserId}`;
      form.reset();
    } else {
      status.textContent = `❌ Ошибка: ${data.message || "Неизвестная ошибка"}`;
    }
  } catch (err) {
    console.error("Error:", err);
    status.textContent = "⚠ Не удалось отправить заявку";
  }
});

// Chat widget
const chatBtn = document.createElement("button");
chatBtn.textContent = "💬 Чат с админом";
chatBtn.style.position = "fixed";
chatBtn.style.bottom = "20px";
chatBtn.style.right = "20px";
chatBtn.style.padding = "12px 18px";
chatBtn.style.borderRadius = "10px";
chatBtn.style.background = "linear-gradient(90deg, #8A5DFF, #00C2FF)";
chatBtn.style.color = "#fff";
chatBtn.style.border = "none";
chatBtn.style.cursor = "pointer";
chatBtn.style.zIndex = "1000";
document.body.appendChild(chatBtn);

chatBtn.addEventListener("click", async () => {
  if (!currentUserId) {
    alert("Сначала отправьте заявку!");
    return;
  }

  let msg = prompt("Введите сообщение администратору:");
  if (msg) {
    try {
      const res = await fetch(`${BACKEND_URL}/send_message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, text: msg, sender: "user" })
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert("Сообщение отправлено!");
      } else {
        alert(`Ошибка: ${data.message || "Неизвестная ошибка"}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Не удалось отправить сообщение!");
    }
  }
});