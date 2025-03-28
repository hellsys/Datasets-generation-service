<template>
  <div class="flex bg-base-200">
    <div
      class="m-auto w-3/4 bg-base-100 shadow-xl rounded-3xl py-6 px-12 my-12"
      :class="{ 'animate-shake': shake }"
    >
      <button
        class="btn btn-ghost tooltip"
        :data-tip="$t('tooltiphistory')"
        @click="handlerFetchText"
      >
        <img v-if="!loading" src="../assets/globe.png" alt="globe" />
        <span v-else class="loading loading-spinner"></span>
      </button>
      <div class="flex">
        <h1 class="my-6 mx-auto text-3xl font-bold">
          {{ t("titleText") }}
        </h1>
      </div>
      <div class="radio-container label mb-2">
        <label class="radio-label cursor-pointer">
          <input
            type="radio"
            name="radio-1"
            class="radio radio-primary"
            v-model="selectedOption"
            value="theme"
          />
          <span class="label-text font-body text-lg font-normal">{{ $t("theme") }}</span>
        </label>
        <label class="radio-label cursor-pointer">
          <input
            type="radio"
            name="radio-1"
            class="radio radio-primary"
            v-model="selectedOption"
            value="keywords"
          />
          <span class="label-text font-body text-lg font-normal">
            {{ $t("keywords") }}
          </span>
        </label>
        <label class="radio-label cursor-pointer">
          <input
            type="radio"
            name="radio-1"
            class="radio radio-primary"
            v-model="selectedOption"
            value="example"
          />
          <span class="label-text font-body text-lg font-normal">{{
            $t("exampleText")
          }}</span>
        </label>
      </div>
      <div class="mx-20">
        <div class="theme flex input-group" v-if="selectedOption === 'theme'">
          <p
            class="label-input font-body text-lg border-b-2 border-primary pb-2 font-normal w-1/3"
          >
            {{ $t("themeText") }}
          </p>
          <div class="pl-2 w-1/2">
            <input
              type="text"
              :placeholder="$t('inTheme')"
              class="input input-bordered input-primary w-full"
              v-model="theme"
            />
          </div>
        </div>
        <div
          class="keywords flex flex-col input-group"
          v-else-if="selectedOption === 'keywords'"
        >
          <div class="flex items-center w-full">
            <p
              class="label-input font-body w-1/3 text-lg border-b-2 border-primary pb-2 mx-0 font-normal"
            >
              {{ $t("keywordsText") }}
            </p>
            <input
              type="text"
              :placeholder="$t('inKeywords')"
              class="input input-bordered input-primary w-1/2 ml-6"
              v-model="newKeyword"
              @keydown.enter="addKeyword"
            />
            <div class="tooltip" :data-tip="$t('tooltipkey')">
              <button class="btn btn-ghost">
                <img src="../assets/info.png" alt="info" />
              </button>
            </div>
          </div>

          <div class="badge-container mt-4 flex flex-row gap-x-2">
            <div
              v-for="(keyword, index) in keywords"
              :key="index"
              class="badge badge-accent h-10 min-w-24 justify-around items-center"
            >
              <span>{{ keyword[0] }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block h-4 w-4 stroke-current cursor-pointer"
                @click="removeKeyword(index)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
          </div>
          <div class="flex items-center w-full mt-4">
            <p
              class="label-input w-1/3 font-body text-lg border-b-2 border-primary pb-2 font-normal"
            >
              {{ $t("countSynonyms") }}
            </p>
            <div class="radio-container ml-2">
              <label class="radio-label cursor-pointer mb-2 w-5/6">
                <input
                  type="radio"
                  name="radio-synonyms"
                  class="radio radio-primary"
                  value="same"
                  v-model="synonymMode"
                />
                <span class="label-text font-body text-lg font-normal">{{
                  $t("same")
                }}</span>
                <div class="mt-4" v-show="synonymMode === 'same'">
                  <input
                    type="number"
                    class="input input-primary input-bordered w-16 h-10"
                    min="0"
                    v-model.number="sameSynonymCount"
                  />
                </div>
              </label>
              <label class="radio-label cursor-pointer mb-2">
                <input
                  type="radio"
                  name="radio-synonyms"
                  class="radio radio-primary"
                  value="different"
                  v-model="synonymMode"
                />
                <span class="label-text font-body text-lg font-normal">{{
                  $t("different")
                }}</span>
              </label>
            </div>
          </div>

          <!-- Поля ввода для каждого ключевого слова -->
          <div v-show="synonymMode === 'different'" class="w-1/5">
            <div v-for="(keyword, index) in keywords" :key="index" class="mb-2 flex">
              <label class="label">
                <span>{{ keyword[0] }}:</span>
              </label>
              <input
                type="number"
                class="input input-primary input-bordered w-16 h-10"
                min="0"
                v-model.number="individualSynonymCounts[index]"
              />
            </div>
          </div>
          <div class="w-2/5 mt-2 ml-24">
            <button
              class="btn btn-accent font-body text-lg font-normal"
              @click="showSynonymsModal"
            >
              <span v-if="!loadingSyn">{{ $t("synonyms") }}</span>
              <span v-else class="loading loading-spinner"></span>
            </button>
            <dialog id="my_modal_3" ref="synonymsModal" class="modal">
              <div class="modal-box">
                <form method="dialog">
                  <button
                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    @click="closeModal"
                  >
                    ✕
                  </button>
                </form>

                <h3 class="text-2xl font-bold mb-4">{{ $t("syn") }}</h3>
                <div v-if="synonyms.length" class="flex gap-14 flex-wrap">
                  <div
                    v-for="(item, index) in synonyms"
                    :key="index"
                    class="bg-primary rounded-xl py-2"
                  >
                    <h4 class="text-xl px-4 mb-2">{{ item.word }}:</h4>
                    <ul>
                      <li
                        v-for="synonym in item.synonyms"
                        :key="synonym"
                        class="px-4 mb-2 font-body text-lg font-normal"
                      >
                        {{ synonym }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-else>
                  <p>{{ $t("notFound") }}</p>
                </div>
              </div>
            </dialog>
          </div>
        </div>
        <div class="example flex input-group" v-else-if="selectedOption === 'example'">
          <p
            class="label-input font-body text-lg border-b-2 border-primary w-1/3 pb-2 font-normal"
          >
            {{ $t("example") }}
          </p>
          <textarea
            class="textarea textarea-primary textarea-bordered w-1/2 pl-4 ont-body text-lg"
            :placeholder="$t('inExample')"
            v-model="exampleText"
          ></textarea>
        </div>
        <div>
          <div class="volume-text flex input-group">
            <p
              class="label-input w-1/3 border-b-2 border-primary pb-2 font-body text-lg font-normal"
            >
              {{ $t("volume") }}
            </p>
            <div class="radio-container ml-2">
              <label class="radio-label cursor-pointer mb-2">
                <input
                  type="radio"
                  name="radio-volume"
                  class="radio radio-primary"
                  v-model="volumeType"
                  value="sentences"
                />
                <span class="label-text font-body text-lg font-normal">{{
                  $t("sentences")
                }}</span>
                <div class="mt-4" v-show="volumeType === 'sentences'">
                  <input
                    type="number"
                    class="input input-primary input-bordered w-16 h-10"
                    min="0"
                    v-model.number="lengthText"
                  />
                </div>
              </label>
              <label class="radio-label cursor-pointer mb-2">
                <input
                  type="radio"
                  name="radio-volume"
                  class="radio radio-primary"
                  v-model="volumeType"
                  value="words"
                />
                <span class="label-text font-body text-lg font-normal">{{
                  $t("words")
                }}</span>
                <div v-show="volumeType === 'words'" class="mt-4">
                  <input
                    type="number"
                    class="input input-primary input-bordered w-16 h-10"
                    min="0"
                    v-model.number="lengthText"
                  />
                </div>
              </label>
              <label class="radio-label cursor-pointer mb-2">
                <input
                  type="radio"
                  name="radio-volume"
                  class="radio radio-primary"
                  v-model="volumeType"
                  value="characters"
                />
                <span class="label-text font-body text-lg font-normal">{{
                  $t("char")
                }}</span>
                <div class="mt-4" v-show="volumeType === 'characters'">
                  <input
                    type="number"
                    class="input input-primary input-bordered w-16 h-10"
                    min="0"
                    v-model.number="lengthText"
                  />
                </div>
              </label>
            </div>
          </div>
          <div class="flex input-group">
            <p
              class="label-input w-1/3 border-b-2 border-primary pb-2 font-body text-lg font-normal"
            >
              {{ $t("countText") }}
            </p>
            <label class="cursor-pointer ml-2">
              <input
                type="number"
                min="1"
                class="input input-primary input-bordered input-neutral w-16 h-10 mr-8"
                v-model.number="textCount"
              />
            </label>
          </div>
          <div class="flex input-group">
            <p
              class="label-input w-1/3 border-b-2 border-primary pb-2 font-body text-lg font-normal"
            >
              {{ $t("temperature") }}
            </p>
            <label class="cursor-pointer ml-2">
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                class="input input-primary input-bordered input-neutral w-16 h-10"
                v-model.number="temperature"
              />
            </label>
            <div class="tooltip" :data-tip="$t('tooltiptemp')">
              <button class="btn btn-ghost">
                <img src="../assets/info.png" alt="info" />
              </button>
            </div>
          </div>
          <div class="flex input-group">
            <p
              class="label-input w-1/3 border-b-2 border-primary pb-2 font-body text-lg font-normal"
            >
              {{ $t("showExample") }}
            </p>
            <input
              type="checkbox"
              name="checkbox-1"
              class="checkbox checkbox-primary ml-2"
              v-model="showExampleText"
            />
          </div>
        </div>
        <div
          v-show="showExampleText"
          v-for="(item, index) in getText"
          :key="index"
          class="my-4 ml-36 items-end"
        >
          <div
            class="border-2 border-primary rounded-3xl p-4 my-4 font-body text-lg font-normal"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="flex gap-x-3">
        <button
          class="btn btn-accent mt-4 w-3/6 m-auto font-body text-lg font-normal my-6"
          @click="validateForm"
        >
          <span v-if="!loadingGen">{{ $t("gen") }}</span>
          <span v-else class="loading loading-spinner"></span>
        </button>
        <button
          class="btn btn-accent mt-4 w-1/6 m-auto font-body text-lg font-normal my-6"
          @click="reset"
        >
          {{ $t("reset") }}
        </button>
        <dialog id="my_modal_3" ref="textsModal" class="modal">
          <div class="modal-box">
            <form method="dialog">
              <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                @click="closeModal"
              >
                ✕
              </button>
            </form>

            <h3 v-if="texts.length" class="text-xl font-bold mb-4">
              {{ $t("success") }}
            </h3>
            <h3 v-else class="text-xl font-bold mb-4">
              {{ $t("error") }}
            </h3>
            <div class="flex flex-col gap-6">
              <div v-for="(item, index) in texts" :key="index">
                {{ $t("Text") }} {{ index }}:
                <div
                  class="border-2 border-primary rounded-3xl p-4 my-4 font-body text-lg font-normal"
                >
                  {{ item }}
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </div>
      <dialog id="my_modal_4" ref="textsAllModal" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              @click="closeModal"
            >
              ✕
            </button>
          </form>

          <h3 v-if="textsAll.length" class="text-xl font-bold mb-4">
            {{ $t("success") }}
          </h3>
          <h3 v-else class="text-xl font-bold mb-4">
            {{ $t("errors.request") }}
          </h3>
          <div class="flex flex-col gap-6">
            <div v-for="(item, index) in textsAll" :key="index">
              {{ $t("Text") }} {{ index }}:
              <div
                class="border-2 border-primary rounded-3xl p-4 my-4 font-body text-lg font-normal"
              >
                {{ item.text }}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { logout } from "../services/logout";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
const { t } = useI18n();
const toast = useToast();
const router = useRouter();
const selectedOption = ref("theme"); // По умолчанию выбираем "По теме"
const keywords = ref([]); // Список ключевых слов
const newKeyword = ref(""); // Новое ключевое слово
const synonymMode = ref("same"); // "same" или "different"
const sameSynonymCount = ref(null); // Количество синонимов для всех ключевых слов
const individualSynonymCounts = ref([]); // Количество синонимов для каждого слова
const theme = ref(""); // Тема текста
const exampleText = ref(""); // Пример текста
const getText = ref("");
const volumeType = ref("sentences"); // Тип объема текста
const lengthText = ref(0);
const synonyms = ref([]);
const texts = ref([]);
const textsAll = ref([]);
const textCount = ref(); // Количество текстов
const showExampleText = ref(false); // Показать пример текста
const synonymsModal = ref(null);
const textsModal = ref(null);
const textsAllModal = ref(null);
const EXAMPLE_TEXT_COUNT = 1;
const shake = ref(false);
const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_BASE_URL;
const temperature = ref(1); // Начальное значение
const loading = ref(false);
const loadingSyn = ref(false);
const loadingGen = ref(false);

// Функция для добавления ключевого слова
const addKeyword = () => {
  if (newKeyword.value.trim()) {
    keywords.value.push([newKeyword.value.trim()]); // Добавляем как массив
    newKeyword.value = ""; // Очистка поля ввода
  }
};

// Функция для удаления ключевого слова
const removeKeyword = (index) => {
  keywords.value.splice(index, 1); // Удаляем массив с ключевым словом по индексу
  individualSynonymCounts.value.splice(index, 1); // Удаляем соответствующий счетчик
};

watch(showExampleText, async (newValue) => {
  if (newValue) {
    try {
      await generateText(EXAMPLE_TEXT_COUNT);
    } catch (error) {
      toast.error(t("errors.request"));
    }
  }
});

watch(temperature, (newValue) => {
  if (newValue < 0) {
    temperature.value = 0;
  } else if (newValue > 2) {
    temperature.value = 2;
  }
});

watch(textCount, (newValue) => {
  if (newValue < 1) {
    textCount.value = 1;
  }
});

// Функция для генерации текста
const generateText = async (numsamples) => {
  let data = {};

  // Добавляем данные в зависимости от выбранного варианта
  if (selectedOption.value === "theme") {
    data = {
      theme: theme.value,
    };
  } else if (selectedOption.value === "keywords") {
    data = {
      key_words: keywords.value,
      synonym_count:
        synonymMode.value === "same"
          ? sameSynonymCount.value
          : individualSynonymCounts.value,
    };
  } else if (selectedOption.value === "example") {
    data = {
      example_text: exampleText.value,
    };
  }

  // Добавляем дополнительные заголовки
  data.num_samples = numsamples; // Количество текстов
  data.max_length = lengthText.value; // Объем текстов
  data.max_length_type = volumeType.value; // Тип максимальной длины (например, по символам или по словам)
  data.temperature = temperature.value;

  try {
    loadingGen.value = true;
    const response = await fetch(`${BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data), // Преобразуем объект в строку JSON
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Проверяем статус ошибки
        logout(router, toast, t); // Вызываем функцию выхода
      }
      throw new Error(t("errors.network"));
    }

    const result = await response.json();
    if (numsamples === EXAMPLE_TEXT_COUNT) {
      getText.value = result.generated_texts;
    } else {
      texts.value = result.generated_texts;
    }
  } catch (error) {
    toast.error(t("errors.request"));
  } finally {
    loadingGen.value = false;
  }
};

const handlerGenerateText = async () => {
  texts.value = [];
  try {
    await generateText(textCount.value);
  } catch (error) {
    toast.error(t("errors.request"));
  }
  textsModal.value.showModal();
};

const handlerFetchText = async () => {
  textsAll.value = [];
  try {
    await fetchTexts();
  } catch (error) {
    toast.error(t("errors.request"));
  }
  textsAllModal.value.showModal();
};

const showSynonymsModal = async () => {
  synonyms.value = [];
  try {
    await generateSynonyms();
  } catch (error) {
    toast.error("Error in showSynonymsModal");
  }
  synonymsModal.value.showModal();
};

const closeModal = () => {
  if (synonymsModal) {
    synonymsModal.value.close();
  } else if (textsModal) {
    textsModal.value.close();
  } else if (textsAll) {
    textsAllModal.value.close();
  }
};

const generateSynonyms = async () => {
  const data = {
    word_count_pairs: keywords.value.map((keyword, index) => ({
      word: keyword[0],
      count:
        synonymMode.value === "same"
          ? sameSynonymCount.value
          : individualSynonymCounts.value[index],
    })),
  };

  try {
    loadingSyn.value = true;
    const response = await fetch(`${BASE_URL}/synonyms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Проверяем статус ошибки
        logout(router, toast, t); // Вызываем функцию выхода
      }
      throw new Error(t("errors.network"));
    } else {
      const result = await response.json();
      synonyms.value = result;
      keywords.value = synonyms.value.map((item) => [item.word, ...item.synonyms]);
    }
  } catch (error) {
    toast.error(t("errors.request"));
  } finally {
    loadingSyn.value = false;
  }
};

const validateForm = () => {
  if (selectedOption.value === "theme") {
    if (!theme.value || !textCount.value || !lengthText.value || !temperature.value) {
      shake.value = true;
      setTimeout(() => (shake.value = false), 500); // Убираем эффект через 500 мс
    } else {
      handlerGenerateText();
    }
  } else if (selectedOption.value === "keywords") {
    // Проверяем, зависит ли логика от режима синонимов
    const isSynonymNotValid =
      synonymMode.value === "same"
        ? !sameSynonymCount.value
        : !individualSynonymCounts.value;
    if (
      !keywords.value ||
      !textCount.value ||
      !lengthText.value ||
      isSynonymNotValid ||
      !temperature.value
    ) {
      shake.value = true;
      setTimeout(() => (shake.value = false), 500); // Убираем эффект через 500 мс
    } else {
      handlerGenerateText();
    }
  } else if (selectedOption.value === "example") {
    if (
      !exampleText.value ||
      !textCount.value ||
      !lengthText.value ||
      !temperature.value
    ) {
      shake.value = true;
      setTimeout(() => (shake.value = false), 500); // Убираем эффект через 500 мс
    } else {
      handlerGenerateText();
    }
  }
};

const fetchTexts = async () => {
  try {
    loading.value = true;
    const response = await fetch(`${BASE_URL}/generated_texts`, {
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
    const result = await response.json();
    textsAll.value = result.generated_texts;
  } catch (err) {
    error.value = t("errors.fetch");
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  keywords.value = [];
  synonyms.value = [];
  textCount.value = 1;
  lengthText.value = 0;
  temperature.value = 1;
  sameSynonymCount.value = 0;
  individualSynonymCounts.value = 0;
  texts.value = [];
  theme.value = "";
  exampleText.value = "";
  getText.value = "";
  showExampleText.value = "";
};
</script>

<style>
.radio-container {
  justify-content: center !important;
  gap: 10px; /* Отступ между кнопками */
}
.input-group {
  align-items: center; /* Вертикальное выравнивание */
  margin-bottom: 16px; /* Отступ между строками */
}

.radio-label {
  display: flex; /* Позволяет располагать элементы в одной строке */
  align-items: center; /* Вертикальное выравнивание по центру */
  gap: 10px; /* Отступ между радио-кнопкой и текстом */
}
.label-input {
  width: 150px; /* Задаем одинаковую ширину для всех меток */
  text-align: right; /* Выравниваем текст справа */
  margin-right: 16px; /* Отступ между меткой и инпутом */
}

.modal-box {
  max-width: 1000px !important;
}
</style>
