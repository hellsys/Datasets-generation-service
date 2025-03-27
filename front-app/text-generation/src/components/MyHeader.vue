<template>
  <div :data-theme="theme" class="bg-base-300 text-base-content p-4">
    <div class="flex justify-between mx-6 items-center">
      <div>
        <!-- Переключатель темы -->
        <label class="swap swap-rotate mx-4">
          <!-- Чекбокс для управления темой -->
          <input
            type="checkbox"
            @change="toggleTheme"
            :checked="theme === 'mythemedark'"
          />

          <!-- Иконка солнца -->
          <svg
            class="swap-off h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
            />
          </svg>

          <!-- Иконка луны -->
          <svg
            class="swap-on h-10 w-10 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
            />
          </svg>
        </label>

        <!-- Переключатель языка -->
        <label class="swap swap-flip text-2xl mx-4">
          <!-- Чекбокс для смены языка -->
          <input
            type="checkbox"
            @change="changeLanguage"
            :checked="selectedLang === 'en'"
          />

          <!-- Иконка английского флага -->
          <div class="swap-on">
            <img src="../assets/gb.png" alt="English" class="w-10 h-10 rounded-full" />
          </div>

          <!-- Иконка русского флага -->
          <div class="swap-off">
            <img src="../assets/ru.png" alt="Русский" class="w-10 h-10 rounded-full" />
          </div>
        </label>
      </div>

      <!-- Условие для отображения кнопок только на страницах, не равных "/signin" и "/signup" -->
      <div v-if="!['/signin', '/signup'].includes(route.path)">
        <button class="btn btn-ghost ont-body text-lg font-normal">
          <router-link to="/" class="router">
            <img
              src="../assets/home.png"
              alt="home"
              :class="
                theme === 'mythemedark' ? 'invert brightness-200 w-10 h-10' : 'w-10 h-10'
              "
            />
          </router-link>
        </button>
        <button class="btn btn-ghost ont-body text-lg font-normal">
          <router-link to="/generation" class="router">
            <img
              src="../assets/use.png"
              alt="use"
              :class="
                theme === 'mythemedark' ? 'invert brightness-200 w-10 h-10' : 'w-10 h-10'
              "
            />
          </router-link>
        </button>
        <button class="btn btn-ghost ont-body text-lg font-normal">
          <router-link to="/profile" class="router">
            <img
              src="../assets/lk.png"
              alt="lk"
              :class="
                theme === 'mythemedark' ? 'invert brightness-200 w-10 h-10' : 'w-10 h-10'
              "
            />
          </router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { locale } = useI18n(); // Доступ к i18n
const selectedLang = ref(localStorage.getItem("lang") || "en");
const theme = ref(localStorage.getItem("theme") || "mythemedark");

// Получаем текущий маршрут
const route = useRoute();

const toggleTheme = () => {
  theme.value = theme.value === "mythemedark" ? "mythemelight" : "mythemedark";
  document.documentElement.setAttribute("data-theme", theme.value);
  localStorage.setItem("theme", theme.value);
};

const changeLanguage = () => {
  const newLang = selectedLang.value === "en" ? "ru" : "en";
  selectedLang.value = newLang;
  locale.value = newLang;
  localStorage.setItem("lang", newLang);
};

onMounted(() => {
  document.documentElement.setAttribute("data-theme", theme.value);
});
</script>
