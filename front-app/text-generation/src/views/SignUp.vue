<template>
  <div class="flex justify-center items-center py-6">
    <div
      v-if="!successMessage"
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
              ><span class="text-error">*</span> {{ t("email") }}</span
            >
          </label>
          <input
            type="text"
            placeholder="example@mail.ru"
            class="input input-bordered input-primary w-full"
            v-model="email"
          />
        </div>
        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span> {{ t("username") }}</span
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
        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text">
              <span class="text-error">*</span> {{ t("passconf") }}
            </span>
          </label>
          <input
            type="password"
            :placeholder="t('passconfinp')"
            class="input input-bordered input-primary w-full"
            v-model="confirmPassword"
          />
        </div>

        <!-- Ошибка пароля -->
        <div v-if="passwordError" class="alert alert-error shadow-lg mb-4">
          <div>
            <span>{{ t("errors.passwordMismatch") }}</span>
          </div>
        </div>

        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span> {{ t("fullname") }}</span
            >
          </label>
          <input
            type="text"
            :placeholder="t('fullnameinp')"
            class="input input-bordered input-primary w-full"
            v-model="fullname"
          />
        </div>

        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span> {{ t("country") }}</span
            >
          </label>
          <input
            type="text"
            :placeholder="t('countryinp')"
            class="input input-bordered input-primary w-full"
            v-model="country"
          />
        </div>

        <div class="form-control w-full mb-4">
          <label class="label">
            <span class="label-text"
              ><span class="text-error">*</span> {{ t("age") }}</span
            >
          </label>
          <input
            type="number"
            placeholder="18"
            class="input input-bordered input-primary w-full"
            v-model="age"
          />
        </div>

        <div class="form-control mt-8">
          <Loader v-if="loading" />
          <button v-else class="btn btn-primary w-full" @click="validateForm">
            {{ t("signupbut") }}
          </button>
        </div>
        <div v-if="!validation" role="alert" class="alert alert-warning mt-4">
          <span>{{ t("validate") }}</span>
        </div>
      </div>
    </div>
    <div v-else class="card bg-primary text-primary-content w-auto mt-16">
      <div class="card-body">
        <h2 class="card-title">{{ t("registration") }}</h2>
        <div class="card-actions justify-end mt-8">
          <router-link to="/signin">
            <button class="btn btn-accent">{{ t("account") }}</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Loader from "../components/myLoader.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const passwordError = ref("");
const error = ref("");
const validation = ref(true);
const fullname = ref("");
const username = ref("");
const country = ref("");
const loading = ref(false);
const age = ref();
const shake = ref(false);
const successMessage = ref("");
const BASE_URL = import.meta.env.VITE_BASE_URL;

watch([password, confirmPassword], ([newPassword, newConfirmPassword]) => {
  if (newPassword && newConfirmPassword && newPassword !== newConfirmPassword) {
    passwordError.value = true;
  } else {
    passwordError.value = false;
  }
});

const validateForm = () => {
  if (
    !email.value ||
    !username.value ||
    !password.value ||
    !confirmPassword.value ||
    !fullname.value ||
    !country.value ||
    !age.value
  ) {
    shake.value = true;
    validation.value = false;
    setTimeout(() => (shake.value = false), 500); // Убираем эффект через 500 мс
  } else {
    registerUser();
    validation.value = true;
  }
};

const registerUser = async () => {
  passwordError.value = "";
  error.value = "";

  const data = {
    email: email.value,
    password: password.value,
    username: username.value,
    fullname: fullname.value,
    country: country.value,
    age: age.value,
  };

  try {
    loading.value = true;

    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Error registration");
    } else {
      successMessage.value = true;
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
