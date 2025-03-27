<template>
  <div id="app" class="min-h-screen">
    <MyHeader />
    <router-view></router-view>
  </div>
</template>

<script setup>
import MyHeader from "./components/MyHeader.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem("token");

  if (token) {
    // Если токен есть, перенаправляем пользователя на главную страницу
    router.push("/");
  } else {
    router.push("/signup");
  }
});
</script>
