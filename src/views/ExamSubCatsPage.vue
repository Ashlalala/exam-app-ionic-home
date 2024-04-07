<template>
  <base-layout title="Exams">
  <IonButton expand="full" :router-link="URL_SUBCAT + '/create'">
    Create a new Exam in {{URL_CAT + ' > ' + URL_SUBCAT }}
  </IonButton>
  <ExamList :exams="response.exams" :cat="URL_CAT" :subCat="URL_SUBCAT" />
  </base-layout>
</template>

<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonBackButton, IonItem, IonItemGroup } from '@ionic/vue';
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


// axios.get('http://localhost:8000/sanctum/csrf-cookie')
axios.get(API_URL + '/api/exams/' + URL_CAT + '/' + URL_SUBCAT).then(res => {
  console.log(res)
  response.value.exams = res.data.data
})





</script>