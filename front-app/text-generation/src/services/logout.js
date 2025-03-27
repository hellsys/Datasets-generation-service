export const logout = (router, toast, t) => {
  toast.warning(t("session"));

  // Удаляем токен из localStorage
  localStorage.removeItem("token");

  // Перенаправляем на страницу входа
  router.push("/signin");
};
