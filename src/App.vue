<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-layout>
    <v-app-bar color="#1a1d20">
      <template v-slot:prepend>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title><img class="appbar-logo" src="./assets/pictures/logo.png" alt=""></v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>
  </v-layout>
  <div class="main">
    <RouterView />
  </div>
</template>
