<template>
  <base-layout title="Exams">
    <ion-list>
      <ion-list-header>
        <ion-label>Choose from {{ URL_CAT }}</ion-label>
      </ion-list-header>
      <ion-item-group>
        <ion-item v-for="category in response.categories" :router-link="'/exams/' + URL_CAT + '/' + category.name">
          <ion-label class="ion-text-nowrap">
            <h2>{{ category.name }}</h2>
          </ion-label>
        </ion-item>
      </ion-item-group>
    </ion-list>
  </base-layout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'

const URL_CAT = useRoute().params.category
const API_URL = inject('API_URL')
const response = ref({})


// axios.get('http://localhost:8000/sanctum/csrf-cookie')
axios.get(API_URL + '/api/' + URL_CAT).then(res => {
  console.log(res)
  response.value.categories = res.data
})


</script>
