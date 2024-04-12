<template>
<base-layout>
  <template v-if="response.completedExam && response.exam && response.owner">
    <ExamCard :response="response" :completed="true"/>

    <template v-if="response.all">
      <QuestionList :all="response.all" />
    </template>
  
    <ion-spinner v-else></ion-spinner>
  </template>

</base-layout>
</template>

<script setup>

import { useRoute } from 'vue-router'
import axios from 'axios';
import { ref } from 'vue';
import { inject } from 'vue'
import { IonItem, IonLabel, IonList, IonListHeader, IonHeader, IonSpinner  } from '@ionic/vue'; //for the list 
import ExamCard from '@/components/ExamCard.vue';
import QuestionList from '@/components/QuestionList.vue';

import { onMounted } from 'vue';
import {useMainStore} from '@/stores/MainStore'

const store = useMainStore()

const URL_EXAM_ID = useRoute().params.examId
const API_URL = inject('API_URL')

const response = ref({})

onMounted(async () => {
  await getCompleted()
  await getExamAndOwner()
  await getAnsweredQAs()
  await getQAs()
  await getGroups()
  // if(response.value.groups.length && response.value.qas.length) 
  // else response.value.all = response.value.groups
  sortGroupsAndQAs(response.value.groups, response.value.qas)

  console.log('ssssssssssssssssssssssss', response.value)
})

function sortGroupsAndQAs(groups, qas){
  let joinedArr = [...groups, ...qas]
  joinedArr.sort((a, b) => compareDates(a.created_at, b.created_at))
  response.value.all = joinedArr
}

async function getAnsweredQAs() {
  await axios.get(API_URL + '/api/completed/' + URL_EXAM_ID + '/qa').then(res => {
    response.value.answeredQas=res.data
  })
}

async function getQAs() {

  response.value.qas = []

  response.value.answeredQas.forEach(async (answeredQa) => {
    await axios.get(API_URL + '/api/completed/qa/' + answeredQa.qa_id).then(res => {
      let qa = res.data.data
      let qaNew = {
        id: qa.id,
        created_at: qa.created_at,
        question: qa.question,
        answers: []
      }
      const responseAnswers = getCleanedAndLabeledAndDecrypted([qa.ans_r, qa.ans_1, qa.ans_2, qa.ans_3, qa.ans_4, qa.ans_5], qa.id, store.secretKey, store.iv) //The right answer should always be the first in the input array
      qaNew.answers = mixUp(responseAnswers)
      response.value.qas.push(qaNew)
    })
  });
}

async function getGroups() {
  await axios.get(API_URL + '/api/completed/' + URL_EXAM_ID + '/groups').then(res => {
    response.value.groups = []
    res.data.data.forEach(g => {
      response.value.groups.push(g)
    })
  })
}

async function getCompleted(){
  await axios.get(API_URL + '/api/completed/' + URL_EXAM_ID).then(async res => {
    response.value.completedExam = res.data
    await getExamOwner()
  })
}

async function getExamAndOwner(){
  await axios.get(API_URL + '/api/exam/' + response.value.completedExam.exam_id).then(async res => {
    response.value.exam = res.data.data
    await getExamOwner()
  })
}


async function getExamOwner(){
  await axios.get(API_URL + '/api/user/' + response.value.completedExam.user_id).then(res => {
    response.value.owner = res.data
  })
}





function mixUp(arr){
  let l = arr.length
  let output = []

  for(let i = 0; i<l; i++){
    let randIndexInArr = Math.floor(Math.random()*arr.length)    
    output.push(arr[randIndexInArr])
    arr.splice(randIndexInArr, 1)
  }
  return output
}

function getCleanedAndLabeledAndDecrypted(arr, qaId, key, iv){
  const ansArr = []
  arr.forEach((value, i) => {
    let valueD = getDAesString(value, key, iv)
    if(valueD) {
      let ans = {
        val: valueD,
        right: i == 0 ,
        selected: false
      }
      response.value.answeredQas.forEach(qa=>{
        if(valueD == qa.ans && qaId == qa.qa_id) ans.selected = true
      })
      ansArr.push(ans)
    }
  })
  return ansArr
}

function getDAesString(encrypted, key, iv) {//解密
    var key_hash = CryptoJS.MD5(key).toString();
    var key = CryptoJS.enc.Utf8.parse(key_hash);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.AES.decrypt(encrypted, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
}



function compareDates(a, b){
  if(dateAndTimeToInt(a).date > dateAndTimeToInt(b).date) return -1
  if(dateAndTimeToInt(a).time > dateAndTimeToInt(b).time) return -1
  return +1
}

function dateAndTimeToInt(a){
  return {
    date: parseInt(a.slice(0,4)+a.slice(5,7)+a.slice(8,10)),
    time: parseInt(a.slice(11,13)+a.slice(14,16)+a.slice(17,19))
  }
}
</script>

<style scoped>
  ion-spinner {
    justify-self: center;
    align-self: center;
    width: 100px;
    height: 100px;
  }
</style>