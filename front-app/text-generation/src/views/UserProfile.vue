<template>
  <div class="flex justify-center items-center min-h-screen bg-base-200">
    <div class="w-[600px] bg-base-100 shadow-xl">
      <div class="m-8 flex flex-col">
        <h2 class="text-xl text-title text-center pb-6 border-b-2 border-primary">
          {{ $t("lk") }}
        </h2>

        <!-- Загрузка данных -->
        <div v-if="loading" class="text-center">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- Ошибка -->
        <div v-else-if="error" class="text-center text-red-500">
          {{ $t("errors.error") }} {{ error }}
        </div>

        <!-- Данные пользователя -->
        <div class="flex gap-x-8 my-6">
          <div class="flex flex-1 flex-col gap-4 my-auto">
            <span class="font-bold py-2 border-b-2 border-primary">Email:</span>
            <span class="font-bold py-2 border-b-2 border-primary"
              >{{ $t("fullname") }}:</span
            >
            <span class="font-bold py-2 border-b-2 border-primary"
              >{{ $t("username") }}:</span
            >
            <span class="font-bold py-2 border-b-2 border-primary">{{ $t("age") }}:</span>
            <span class="font-bold py-2 border-b-2 border-primary"
              >{{ $t("country") }}:</span
            >
          </div>

          <div class="flex flex-1 flex-col gap-4">
            <span class="p-2 border-2 border-primary rounded-xl">{{ user.email }}</span>
            <span class="p-2 border-2 border-primary rounded-xl">{{
              user.fullname
            }}</span>
            <span class="p-2 border-2 border-primary rounded-xl">{{
              user.username
            }}</span>
            <span class="p-2 border-2 border-primary rounded-xl">{{ user.age }}</span>
            <span class="p-2 border-2 border-primary rounded-xl">{{ user.country }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { logout } from "../services/logout";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
const { t } = useI18n();
const toast = useToast();
const router = useRouter();

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");
const user = ref(null);
const loading = ref(true);
const error = ref("");
user.value = {
  email: t("errors.network"),
  fullname: t("errors.network"),
  username: t("errors.network"),
  age: 0,
  country: t("errors.network"),
};

const fetchUserData = async () => {
  try {
    loading.value = true;
    const response = await fetch(`${BASE_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        // Проверяем статус ошибки
        logout(router, toast, t); // Вызываем функцию выхода
      }
      throw new Error(t("errors.fetch"));
    }
    user.value = await response.json();
  } catch (err) {
    error.value = t("errors.fetch");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUserData);
</script>
