<template>
  <base-layout title="Exams">
    <ExamList :exams="response.exams" />
  </base-layout>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonItem, IonItemGroup } from '@ionic/vue';
import { IonLabel, IonList, IonListHeader } from '@ionic/vue'; //for the list 

import { useRoute } from 'vue-router'
import ExamList from '@/components/ExamList.vue';
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
const API_URL = inject('API_URL')

const routeParams = useRoute().params
const URL_CAT = routeParams.category
const URL_SUBCAT = routeParams.subCategory

const response = ref({
  exams: []
})

console.log(API_URL + '/api/exams/' + URL_CAT + '/' + URL_SUBCAT)

// axios.get('http://localhost:8000/sanctum/csrf-cookie')
axios.get(API_URL + '/api/exams/' + URL_CAT + '/' + URL_SUBCAT).then(res => {
  console.log(res)
  response.value.exams = res.data.data
})





</script>
