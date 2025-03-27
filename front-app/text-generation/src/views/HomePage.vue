<template>
  <div class="flex justify-center my-24">
    <div class="bg-secondary p-8 rounded-3xl flex flex-col mb-6 text-slate-200">
      <h1 class="text-title text-2xl font-bold mx-auto my-6">{{ $t("help") }}</h1>
      <div class="items-center justify-between flex gap-4">
        <div class="flex-1 font-normal text-lg font-body mx-8">
          <ol>
            <li>{{ $t("regVol") }}</li>
            <li>{{ $t("regVolu") }}</li>
            <li>{{ $t("regVolum") }}</li>
            <li>{{ $t("genMet") }}</li>
            <ul>
              <li>→ {{ $t("theme") }}</li>
              <li>→ {{ $t("keywords") }}</li>
              <li>→ {{ $t("exampleText") }}</li>
            </ul>
          </ol>
        </div>
        <div class="image-container">
          <img src="/being-creative.png" alt="card1" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.image-container img {
  max-width: 80%;
  height: auto;
}
</style>
