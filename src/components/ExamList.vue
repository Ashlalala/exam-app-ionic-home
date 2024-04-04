<template>
  <ion-list>
    <ion-list-header>
      <ion-label>Physics > Partical</ion-label>
    </ion-list-header>
    <ion-item v-for="exam in exams">
      <ion-label class="ion-text-nowrap">
        <h2>{{ exam.name }}</h2>
        <p>{{ exam.description }}</p>
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


defineProps({
  exams: {
    type: Array,
    required: true
  }
})

const response = ref({})

</script>
