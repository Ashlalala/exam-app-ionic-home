<template>
  <base-layout title="Exams">
    <ExamList />
  </base-layout>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonItemGroup } from '@ionic/vue';
import { IonLabel, IonList, IonListHeader } from '@ionic/vue'; //for the list 

import ExamList from '@/components/ExamList.vue';
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
const API_URL = inject('API_URL')

const response = ref({})


// axios.get('http://localhost:8000/sanctum/csrf-cookie')
axios.get(API_URL + '/api/cats').then(res => {
  console.log(res)
  response.value.categories = res.data
})



console.log(URL_CAT)

</script>
