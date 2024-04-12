<template>
<base-layout title="Exams">
  Reload function activate when getting back to this page after editing
  <template v-if="response.exam && response.owner">
    <ExamCard :response="response"/>
  </template>
  
  <template v-if="response.qas">
    <ion-button expand="block" v-if="response.qas.length" :router-link="URL_EXAM_ID + '/take'">Take Exam</ion-button>
    <ion-button expand="block" v-else>The Exam is Empty</ion-button>
    <ion-button expand="block" fill="outline" :router-link="URL_EXAM_ID + '/edit'">Add/Remove/Edit Questions</ion-button>
  </template>

</base-layout>
</template>

<script setup>

import { useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';

import { IonButton } from '@ionic/vue';
import ExamCard from '@/components/ExamCard.vue';

const routeParams = useRoute().params
const API_URL = inject('API_URL')
const URL_EXAM_ID = routeParams.examId

const response = ref({})

onMounted(async () => {
  await getExamAndOwner()
  await getQAs()
  await getGroups()
  response.value.exam.qAmount = response.value.qas.length + response.value.groups.length
})

async function getQAs() {
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID + '/qa').then(res => {
    console.log(res)
    // emit('uploaded', true)
    response.value.qas=res.data.data

  })
}

async function getGroups() {
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID + '/group').then(res => {
    response.value.groups = []
    res.data.data.forEach(g => {
      response.value.groups.push(g)
    })
  })
}

async function getExamAndOwner(){
  await axios.get(API_URL + '/api/exam/' + URL_EXAM_ID).then(async res => {
    console.log(res)
    response.value.exam = res.data.data
    await getExamOwner()
  })
}


async function getExamOwner(){
  await axios.get(API_URL + '/api/user/' + response.value.exam.user_id).then(res => {
    console.log(res);
    response.value.owner = res.data
    console.log(response.value.owner)
  })
}





</script>

