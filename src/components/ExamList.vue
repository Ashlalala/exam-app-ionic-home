<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Physics > Partical</ion-label>
    </ion-list-header>
    <ion-item v-for="exam in response.exams">
      <ion-label class="ion-text-nowrap">
        <h2>{{ exam.name }}</h2>
        <p>{{ exam.description }}}</p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script setup>
import { IonItem, IonLabel, IonList, IonListHeader } from '@ionic/vue'; //for the list 
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
const API_URL = inject('API_URL')

const response = ref({})


// axios.get('http://localhost:8000/sanctum/csrf-cookie')
axios.get(API_URL+'/api/exams').then(res => {
  response.value.exams = res.data.data
})
</script>
