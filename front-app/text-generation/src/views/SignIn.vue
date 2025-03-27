<template>
  <div class="flex justify-center items-center py-6">
    <div
      class="w-full max-w-md shadow-xl border border-primary rounded-lg"
      :class="{ 'animate-shake': shake }"
    >
      <div class="px-6 py-8">
        <!-- Навигация между Sign Up и Sign In -->
        <div class="tabs tabs-boxed mb-4">
          <router-link
            to="/signup"
            class="tab"
            :class="{ 'tab-active': $route.path === '/signup' }"
          >
            {{ t("signup") }}
          </router-link>
          <router-link
            to="/signin"
            class="tab"
            :class="{ 'tab-active': $route.path === '/signin' }"
          >
            {{ t("login") }}
          </router-link>
        </div>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="alert alert-warning shadow-lg mb-4">
          <div>
            <span>{{ t("errors.request") }}</span>
          </div>
        </div>

        <!-- Поля ввода -->
        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span> {{ t("login") }}</span
            >
          </label>
          <input
            type="text"
            placeholder="username"
            class="input input-bordered input-primary w-full"
            v-model="username"
          />
        </div>
        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span> {{ t("password") }}</span
            >
          </label>
          <input
            type="password"
            :placeholder="t('passinp')"
            class="input input-bordered input-primary w-full"
            v-model="password"
          />
        </div>

        <!-- Кнопка входа -->
        <div class="form-control mt-8">
          <Loader v-if="loading" />
          <button v-else class="btn btn-primary w-full" @click="validateForm">
            {{ t("loginbut") }}
          </button>
        </div>
        <div v-if="!validation" role="alert" class="alert alert-warning mt-4">
          <span>{{ t("validate") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Loader from "../components/myLoader.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const router = useRouter();

const username = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const shake = ref(false);
const validation = ref(true);

const BASE_URL = import.meta.env.VITE_BASE_URL;
const validateForm = () => {
  if (!username.value || !password.value) {
    shake.value = true;
    validation.value = false;
    setTimeout(() => (shake.value = false), 500); // Убираем эффект через 500 мс
  } else {
    validation.value = true;
    signIn();
  }
};
const signIn = async () => {
  error.value = "";
  loading.value = true;

  const data = {
    username: username.value,
    password: password.value,
  };

  try {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка авторизации");
    }

    const result = await response.json();

    // Сохранение access_token
    localStorage.setItem("token", result.access_token);

    // Перенаправление на главную страницу
    router.replace("/");
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
